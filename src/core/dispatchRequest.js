import adapters from '../adapters';
import transformData from './transformData';
import RequestHeaders from './RequestHeaders';
import defaults from '../defaults';
import isCancel from '../cancel/isCancel';
import CanceledError from '../cancel/CanceledError';

export default function dispatchRequest(config) {
    throwIfCancellationRequested(config);
  
    config.headers = RequestHeaders.from(config.headers);
  
    // Transform request data
    config.data = transformData.call(
        config,
        config.transformRequest,
    );
  
    if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
        config.headers.setContentType('application/x-www-form-urlencoded', false);
    }
  
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
  
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        
        // Transform response data
        response.data = transformData.call(
            config,
            config.transformResponse,
            response,
        );
  
        response.headers = RequestHeaders.from(response.headers);
  
        return response;
    }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
  
            // Transform response data
            if (reason && reason.response) {
                reason.response.data = transformData.call(
                    config,
                    config.transformResponse,
                    reason.response,
                );
                reason.response.headers = RequestHeaders.from(reason.response.headers);
            }
        }
  
        return Promise.reject(reason);
    });
}

function throwIfCancellationRequested(config) {  
    if (config.signal && config.signal.aborted) {
        throw new CanceledError(null, config);
    }
}
  