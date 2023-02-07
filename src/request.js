import utils from './utils';
import bind from './helpers/bind';
import mergeConfig from './core/mergeConfig';
import Request from './core/Request';
import defaults from './defaults';
import isCancel from './cancel/isCancel';
import CanceledError from './cancel/CanceledError';
import RequestError from './core/RequestError';
import spread from './helpers/spread';

function createInstance(defaultConfig) {
    const context = new Request(defaultConfig);
    const instance = bind(Request.prototype.request, context);
      
    // Copy context to instance
    utils.extend(instance, context, null, { allOwnKeys: true });
  
    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
  
    return instance;
}

const request = createInstance(defaults);

request.Request = Request;
request.RequestError = RequestError;
request.isCancel = isCancel;
request.CanceledError = CanceledError;
request.all = function all(promises) {
    return Promise.all(promises);
};
request.spread = spread;
request.default = request;

export default request;

