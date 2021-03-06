import * as HTTPHelper from '../../services/http.helper';


export const getConfiguration = (contentId, callback) => {

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Siteaccess': document.querySelector('meta[name="SiteAccess"]').content,
    };

    const method = 'GET';

    const route = `${HTTPHelper.SEO_CONFIGURATION_ROUTE}/${contentId}`;

    HTTPHelper.makeRequest(headers, method, null, route, function(err, res) {
        return callback(err, res);
    })
}

export const updateConfiguration = (contentId, keyword, isPillarContent, languageCode, callback) => {

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Siteaccess': document.querySelector('meta[name="SiteAccess"]').content,
    };

    const method = 'PUT';

    const route = `${HTTPHelper.SEO_CONFIGURATION_ROUTE}/${contentId}`;

    const body = {
        contentId,
        keyword,
        isPillarContent,
        languageCode
    };

    HTTPHelper.makeRequest(headers, method, body, route, function(err, res) {
        return callback(err, res);
    })
}
