import utils from '../utils';
import formDataToJSON from '../helpers/formDataToJSON';
import toURLEncodedForm from '../helpers/toURLEncodedForm';
import toFormData from '../helpers/toFormData';
import RequestError from '../core/RequestError';
import platform from '../platform';
import transitionalDefaults from './transitional';
import stringifySafely from '../helpers/stringifySafely';

const DEFAULT_CONTENT_TYPE = {
    'Content-Type': undefined,
};

const defaults = {
    transitional: transitionalDefaults,
    adapter: ['xhr'],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  
    maxContentLength: -1,
    maxBodyLength: -1,
  
    env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob,
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    transformRequest: [
        function transformRequest(data, headers) {
            const contentType = headers.getContentType() || '';
            const hasJSONContentType = contentType.indexOf('application/json') > -1;
            const isObjectPayload = utils.isObject(data);
    
            if (isObjectPayload && utils.isHTMLForm(data)) {
                data = new FormData(data);
            }
    
            const isFormData = utils.isFormData(data);
    
            if (isFormData) {
                if (!hasJSONContentType) {
                    return data;
                }
                return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
            }
    
            if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)
            ) {
                return data;
            }
            if (utils.isArrayBufferView(data)) {
                return data.buffer;
            }
            if (utils.isURLSearchParams(data)) {
                headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
                return data.toString();
            }
    
            let isFileList;
    
            if (isObjectPayload) {
                if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                    return toURLEncodedForm(data, this.formSerializer).toString();
                }
    
                if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
                    // eslint-disable-next-line no-underscore-dangle
                    const _FormData = this.env && this.env.FormData;
    
                    return toFormData(
                        isFileList ? { 'files[]': data } : data,
                        _FormData && new _FormData(),
                        this.formSerializer,
                    );
                }
            }
    
            if (isObjectPayload || hasJSONContentType) {
                headers.setContentType('application/json', false);
                return stringifySafely(data);
            }
    
            return data;
        },
    ],
    
    transformResponse: [
        function transformResponse(data) {
            const transitional = this.transitional || defaults.transitional;
            const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
            const JSONRequested = this.responseType === 'json';
    
            if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
                const silentJSONParsing = transitional && transitional.silentJSONParsing;
                const strictJSONParsing = !silentJSONParsing && JSONRequested;
    
                try {
                    return JSON.parse(data);
                } catch (e) {
                    if (strictJSONParsing) {
                        if (e.name === 'SyntaxError') {
                            throw RequestError.from(e, RequestError.ERR_BAD_RESPONSE, this, null, this.response);
                        }
                        throw e;
                    }
                }
            }
    
            return data;
        },
    ],
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*',
        },
    },
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
});
  
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
export default defaults;