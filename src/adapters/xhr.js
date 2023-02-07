import utils from '../utils';
import RequestHeaders from '../core/RequestHeaders';
import buildURL from '../helpers/buildURL';
import buildFullPath from '../core/buildFullPath';
import settle from '../core/settle';
import isURLSameOrigin from '../helpers/isURLSameOrigin';
import transitionalDefaults from '../defaults/transitional';
import parseProtocol from '../helpers/parseProtocol';
import CanceledError from '../cancel/CanceledError';
import RequestError from '../core/RequestError';
import extractParams from '../helpers/extractParams';
import cookies from '../helpers/cookies';
import speedometer from '../helpers/speedometer';

import platform from '../platform';

export default function xhr(config) {   
    // console.log('xhr config', config);
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        const requestData = config.data;
        const responseType = config.responseType;
        const requestHeaders = RequestHeaders.from(config.headers).normalize();
        let onCanceled;
        function done() {      
            if (config.signal) {
                config.signal.removeEventListener('abort', onCanceled);
            }
        }
        if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
            requestHeaders.setContentType(false); // Let the browser set it
        }

        let xhr = new XMLHttpRequest();      
        // HTTP basic authentication
        if (config.auth) {
            const username = config.auth.username || '';
            const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
            requestHeaders.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
        }
        const fullPath = buildFullPath(config.baseURL, buildURL(config.url, extractParams(config.data, config.params), config.paramsSerializer));

        xhr.open(config.method.toUpperCase(), fullPath, true);

        // Set the request timeout in MS
        xhr.timeout = config.timeout;

        xhr.onloadend = function onloadend() {
            if (!xhr) return;
            // Prepare the response
            const responseHeaders = RequestHeaders.from(
                'getAllResponseHeaders' in xhr && xhr.getAllResponseHeaders(),
            );
            const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
                xhr.responseText : xhr.response;
            const response = {
                data: responseData,
                status: xhr.status,
                statusText: xhr.statusText,
                headers: responseHeaders,
                config,
                request: xhr,
            };
            settle(function _resolve(value) {
                resolve(value);
                done();
            }, function _reject(err) {
                reject(err);
                done();
            }, response);
      
            // Clean up request
            xhr = null;
        };
        xhr.onabort = function handleAbort() {
            if (!xhr) return;
            reject(new RequestError('Request aborted', RequestError.ECONNABORTED, config, xhr));
      
            // Clean up request
            xhr = null;
        };
        xhr.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(new RequestError('Network Error', RequestError.ERR_NETWORK, config, xhr));
      
            // Clean up request
            xhr = null;
        };
        xhr.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = config.timeout ? `timeout of ${config.timeout}ms exceeded` : 'timeout exceeded';
            const transitional = config.transitional || transitionalDefaults;
            if (config.timeoutErrorMessage) {
                timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject(new RequestError(
                timeoutErrorMessage,
                transitional.clarifyTimeoutError ? RequestError.ETIMEDOUT : RequestError.ECONNABORTED,
                config,
                xhr));
      
            // Clean up request
            xhr = null;
        };

        if (platform.isStandardBrowserEnv) {
            // Add xsrf header
            const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
              && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
      
            if (xsrfValue) {
                requestHeaders.set(config.xsrfHeaderName, xsrfValue);
            }
        }

        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);
        // Add headers to the request
        utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            xhr.setRequestHeader(key, val);
        });

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
            xhr.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
            xhr.responseType = config.responseType;
        }
        // Handle progress if needed
        if (utils.isFunction(config.onDownloadProgress)) {
            xhr.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
        }
  
        // Not all browsers support upload events
        if (utils.isFunction(config.onUploadProgress) && xhr.upload) {
            xhr.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
        }

        if (config.signal) {
            onCanceled = cancel => {
                if (!xhr) return;
                reject(!cancel || cancel.type ? new CanceledError(null, config, xhr) : cancel);
                xhr.abort();
                xhr = null;
            };
        
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
        }
        
        const protocol = parseProtocol(fullPath);

        if (protocol && platform.protocols.indexOf(protocol) === -1) {
            reject(new RequestError(`Unsupported protocol ${protocol}:`, RequestError.ERR_BAD_REQUEST, config));
            return;
        }
        xhr.send(requestData || null);
    });
}

function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    // eslint-disable-next-line no-underscore-dangle
    const _speedometer = speedometer(50, 250);
  
    return e => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
  
        bytesNotified = loaded;
  
        const data = {
            loaded,
            total,
            progress: total ? (loaded / total) : undefined,
            bytes: progressBytes,
            rate: rate ? rate : undefined,
            estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
            event: e,
        };
  
        data[isDownloadStream ? 'download' : 'upload'] = true;
  
        listener(data);
    };
}