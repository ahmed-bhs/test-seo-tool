
import React from "react";
import { __ } from "../../../../commons/services/language.service";
import { getConfiguration, updateConfiguration } from './configuration.service';
import EzDataContext from "../../ez.datacontext";
import { validateContextData } from '../../services/validator.helper';

const SELECTOR_FIELD = '.ez-field-edit--ezrichtext';
const SELECTOR_INPUT = '.ez-data-source__richtext';

export default class ConfigurationTab extends React.Component {

  constructor(props) {
    super(props);
    this.analysisCallback = props.callback;
    this.state = {
      'focusKeyword': '',
      'isPillarContent': false,
      'loading': true
    }
    this.triggerUpdateConfiguration = this.triggerUpdateConfiguration.bind(this);
    this.onChangeFocusKeyword = this.onChangeFocusKeyword.bind(this)
    this.onChangePillar = this.onChangePillar.bind(this)
    this.addKeywordRequiredFieldError = this.addKeywordRequiredFieldError.bind(this);
    this.removeKeywordRequiredFieldError = this.removeKeywordRequiredFieldError.bind(this);
  }

  componentDidMount() {
    if (validateContextData(this.context)) {
      var self = this;
      getConfiguration(this.context.contentId, function (err, res) {
        if (!err) {
          self.setState({
            focusKeyword: res.keyword ? res.keyword : '',
            isPillarContent: res.is_pillar_content,
          })
        }
        else {
          console.log(err);
        }
        self.setState({
          loading: false
        })
      });
    }
  }

  triggerUpdateConfiguration() {
    const keywordInput = document.querySelector("input[id='keyword']");
    if (!keywordInput.value) {
        this.addKeywordRequiredFieldError();
        return;
    }

    this.setState({
      loading: true
    })
    if (validateContextData(this.context)) {
      var self = this;
      updateConfiguration(this.context.contentId, this.state.focusKeyword, this.state.isPillarContent, this.context.languageCode, function(err, res) {
        self.setState({
          loading: false
        })
        self.analysisCallback(null)
      })
    }
  }

  onChangeFocusKeyword(event) {
    this.setState({focusKeyword: event.target.value})
    if (!event.target.value) {
        this.addKeywordRequiredFieldError();
    }
    else {
        this.removeKeywordRequiredFieldError();
    }
  }

  onChangePillar(event) {
    this.setState({isPillarContent: event.target.checked})

  }

    addKeywordRequiredFieldError() {
        const keywordInput = document.querySelector("input[id='keyword']");
        const keywordInputParent = keywordInput.parentElement;
        const transFieldRequired = __("codein_seo_toolkit.analyzer.error.keywords_required");

        if (!keywordInput.classList.contains('is-invalid')) {
            keywordInput.classList.add('is-invalid');
            let emFieldRequired = document.createElement('em');
            emFieldRequired.classList.add('ez-field-edit__error');
            emFieldRequired.classList.add('mt-1');
            emFieldRequired.innerText = transFieldRequired;
            keywordInputParent.appendChild(emFieldRequired);
        }
    }

    removeKeywordRequiredFieldError() {
        const keywordInput = document.querySelector("input[id='keyword']");
        const keywordInputParent = keywordInput.parentElement;

        keywordInput.classList.remove('is-invalid');
        let emFieldRequired = keywordInputParent.querySelector('.ez-field-edit__error');
        if (emFieldRequired) {
            keywordInputParent.removeChild(emFieldRequired);
        }
    }

  render() {
    let pillarCheckboxStyle = {
      'width': '30px'
    }
    const transConfigurationKeyword = __(
      "codein_seo_toolkit.seo_view.tab_configuration_keyword"
    );
    const transConfigurationIsPillar = __(
      "codein_seo_toolkit.seo_view.tab_configuration_is_pillar"
    );
    const transConfigurationUpdateConfiguration = __(
      "codein_seo_toolkit.seo_view.tab_configuration_update_configuration"
    );
    const transConfigurationKeywordSynonyms = __(
      "codein_seo_toolkit.seo_view.tab_configuration_keyword_synonyms"
    );
    const css = ``
    var buttonContent = transConfigurationUpdateConfiguration;
    if (this.state.loading) {
      buttonContent = (
        <>
          <style>
            {css}
          </style>

          <div className="d-flex justify-content-center">
            <div className="lds-dual-ring"></div>
          </div>
        </>
      )
    }

    return (
      <>
        <form>

          <div className="ez-field-edit">
            <div className="ez-field-edit__label-wrapper">
                <label className="ez-field-edit__label required" for="keyword">{transConfigurationKeyword}</label>
            </div>
            <div className="ez-field-edit__data">
                <div className="ez-data-source">
                  <input type="text" id="keyword" name="keyword" className="ez-data-source__input form-control" value={this.state.focusKeyword} onChange={this.onChangeFocusKeyword} />
                  <em class="light-text">{transConfigurationKeywordSynonyms}</em>
                </div>
            </div>
          </div>
          <div className="ez-field-edit ez-field-edit--ezboolean">
            <div className="ez-field-edit__label-wrapper">
                <label className="ez-field-edit__label" for="isPillarContent">{transConfigurationIsPillar}</label>
            </div>
            <div className="ez-field-edit__data">
              <div className="ez-data-source">
                <input type="checkbox" id="isPillarContent" name="isPillarContent" style={pillarCheckboxStyle} className="ez-data-source__input ez-data-source__input--pillar-content form-control" defaultChecked={this.state.isPillarContent} onChange={this.onChangePillar} />
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-primary" onClick={this.triggerUpdateConfiguration}>{buttonContent}</button>
        </form>
        <hr/>
      </>
    );
  }
}

ConfigurationTab.contextType = EzDataContext;
