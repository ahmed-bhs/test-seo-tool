import React from "react";
import { __ } from "../../../../commons/services/language.service";
import AnalysisCategoryContent from "./analysis.category.content";
import { getAnalysis, getSeoRichText, calculateScore } from './analysis.service';
import { validateContextData } from '../../services/validator.helper';
import EzDataContext from "../../ez.datacontext";

export default class AnalysisTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'selectedSiteaccess': '',
      'fetchCount': 0
    }
    this.siteaccesses = [];
    this.seoData = {};
    this.scores = {};
    this.globalScore = -1;
    this.triggerAnalysis = this.triggerAnalysis.bind(this);
    this.handleSiteAccessChange = this.handleSiteAccessChange.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.renderError = this.renderError.bind(this);
    this.error = false;
  }
  
  componentDidMount() {
    
    if (this.siteaccesses.length) return;
    if (this.context.siteaccesses == "") return;

    let siteaccesses = [];
    try {
      siteaccesses = JSON.parse(this.context.siteaccesses);
    }
    catch (e) {
      console.error(e)
    }
    if (0 in siteaccesses) {
      this.setState({ 'selectedSiteaccess': siteaccesses[0] }, () => {
        // set state is asynchronous, we need to do action that requires it in the callback
        this.triggerAnalysis(null)
      });
    }
    this.siteaccesses = siteaccesses;
  }
  
  /**
   * Provide data and fetch analysis
   */
  triggerAnalysis(e) {
    if(e !== null) e.preventDefault();

    var self = this;
    
    // Deep copy of context data
    let dataContext = {...this.context};
    delete dataContext.siteaccesses;
    dataContext.siteaccess = this.state.selectedSiteaccess;
    
    if (!validateContextData(dataContext)) return;
    getAnalysis(dataContext, getSeoRichText(), (err, res) => {
      if (!err) {
        self.seoData = res;
        self.error = false;
        self.updateScore()
        self.forceUpdate();
      }
      else {
        self.seoData = [];
        if ('message' in res) {
          self.error = res.message;
        }
        else {
          self.error = 'codein_seo_toolkit.analyzer.error.undefined';
        }
      }
      return;
    })
  }

  handleSiteAccessChange(event) {
    this.setState({selectedSiteaccess: event.target.value});
  }

  updateScore() {
    if (!(Object.keys(this.seoData).length === 0 && this.seoData.constructor === Object)) {
      let scores = calculateScore(this.seoData);
      this.globalScore = scores[0];
      this.scores = scores[1];
    }
  }

  renderError() {
    if (this.error) {
      return (
        <>
          <div className="alert alert-danger mt-4" role="alert">
            {__(this.error)}
          </div>
        </>
      )
    }
    else {
      return (
        <>
        </>
      )
    }
  }
  
  getScoreDisplayValue(scores = null, seoCategoryName = null) {
    let score = 0;
    if (scores == null && seoCategoryName == null) {
      score = this.globalScore;
    }
    else if (seoCategoryName in scores) {
      score = scores[seoCategoryName];
    }
    else {
      return '';
    }
      if (score < 33.333) {
        return 'low';
      } else if (score >= 33.333 && score < 66.666) {
        return 'medium';
      } else if (score >= 66.666 && score <= 100) {
        return 'high';
      }
    return '';
  }

  
  render() {
    const transAnalyzeButton = __("codein_seo_toolkit.seo_view.tab_analysis.triggerAnalysis");
    const transTipsSaving = __('codein_seo_toolkit.seo_view.tab_analysis.tips.saving');
    const transTipsTraffic = __('codein_seo_toolkit.seo_view.tab_analysis.tips.traffic');
    const transTipsTrafficGreen = __('codein_seo_toolkit.seo_view.tab_analysis.tips.traffic.green');
    const transTipsTrafficOrange = __('codein_seo_toolkit.seo_view.tab_analysis.tips.traffic.orange');
    const transTipsTrafficRed = __('codein_seo_toolkit.seo_view.tab_analysis.tips.traffic.red');
    const transTipsDeveloper = __('codein_seo_toolkit.seo_view.tab_analysis.tips.developer_support');
    const transGlobalNote = __('codein_seo_toolkit.seo_view.tab_analysis.global_note');
    
    return (
      <>
        <a className="badge badge-info collapsed" data-toggle="collapse" href="#generalHelpCollapse" aria-expanded="false">⚠ Tips</a>
        <div className="collapse" id="generalHelpCollapse">
          <div className="alert alert-info mb-0 mt-3" role="alert">
            <ul>
              <li>{transTipsSaving}</li>
              <li>
                {transTipsTraffic}
                <ul>
                  <li>{transTipsTrafficGreen}</li>
                  <li>{transTipsTrafficOrange}</li>
                  <li>{transTipsTrafficRed}</li>
                </ul>
              </li>
              <li>{transTipsDeveloper}</li>
            </ul>
          </div>
        </div>
        
        <hr class="separator mt-2 mb-2"></hr>

        <div class="ez-field-edit__label-wrapper">
          <label class="ez-field-edit__label" for="ezrepoforms_content_edit_fieldsData_new_type_value">Siteaccess analyzed:</label>
        </div>
        <select id="siteaccess-selection" class="analysis-content__siteaccess-selection form-control" value={this.state.selectedSiteaccess} onChange={this.handleSiteAccessChange}>
          {this.siteaccesses?.map((siteaccess, index) => (
            <option value={siteaccess}>{siteaccess}</option>
          ))}
        </select>
        <div class="accordion" id="accordionCategory">
          {this.renderError()}
          {this.globalScore != -1 ? (
            <div className={"mt-4 badge badge--"+this.getScoreDisplayValue()}>{transGlobalNote}: {this.globalScore}%</div>
          ) : ''}
          {Object.keys(this.seoData)?.map((seoAnalysisCategoryName, index) => (
            <>
              <div className="ez-view-rawcontentview">
                <div className="ez-raw-content-title d-flex justify-content-between mb-3" id={seoAnalysisCategoryName}>
                  <h2 className="mb-0">
                    <span className={"subscore subscore--" + this.getScoreDisplayValue(this.scores, seoAnalysisCategoryName)}></span>
                    <a
                      className={ index == 0 ? "ez-content-preview-toggle": "ez-content-preview-toggle collapsed"}
                      type="button"
                      data-toggle="collapse"
                      data-target={'#' + seoAnalysisCategoryName.split('.').pop()}
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {__(seoAnalysisCategoryName)}
                    </a>
                  </h2>
                </div>
      
                <div
                  id={seoAnalysisCategoryName.split('.').pop()}
                  class={ index == 0 ? "ez-content-preview-collapse collapse show": "ez-content-preview-collapse collapse"}
                  aria-labelledby={seoAnalysisCategoryName.split('.').pop()}
                >
                  <div class="card-body">
                    <AnalysisCategoryContent content={this.seoData[seoAnalysisCategoryName]}/>
                  </div>
                </div>
              </div>
            </>
          ))}

        </div>
  
        <hr class="separator mt-2"></hr>
        <button class="btn btn-primary" onClick={this.triggerAnalysis}>{transAnalyzeButton}</button>
      </>
    );
  }
}

AnalysisTab.contextType = EzDataContext;