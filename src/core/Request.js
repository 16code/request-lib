
import utils from '../utils';
import InterceptorManager from './InterceptorManager';
import RequestHeaders from './RequestHeaders';
import mergeConfig from './mergeConfig';
import validator from '../helpers/validator';
import dispatchRequest from './dispatchRequest';

const validators = validator.validators;

class Request {
    constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        };
    }
    request(configOrUrl, config) {
        // console.log('request config', configOrUrl, config);

        if (typeof configOrUrl === 'string') {
            config = config || {};
            config.url = configOrUrl;
        } else {
            config = configOrUrl || {};
        }
        config = mergeConfig(this.defaults, config);

        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== undefined) {
            validator.assertOptions(transitional, {
                silentJSONParsing: validators.transitional(validators.boolean),
                forcedJSONParsing: validators.transitional(validators.boolean),
                clarifyTimeoutError: validators.transitional(validators.boolean),
            }, false);
        }
        if (paramsSerializer !== undefined) {
            validator.assertOptions(paramsSerializer, {
                encode: validators.function,
                serialize: validators.function,
            }, true);
        }
        config.method = (config.method || this.defaults.method || 'get').toLowerCase();
        const contextHeaders = headers && utils.merge(
            headers.common,
            headers[config.method],
        );
        contextHeaders && utils.forEach(
            ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
            method => {
                delete headers[method];
            },
        );
        config.headers = RequestHeaders.concat(contextHeaders, headers);

        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
                return;
            }

            synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });

        let promise;
        let i = 0;
        let len;

        if (!synchronousRequestInterceptors) {
            const chain = [dispatchRequest.bind(this), undefined];
            // eslint-disable-next-line prefer-spread
            chain.unshift.apply(chain, requestInterceptorChain);
            // eslint-disable-next-line prefer-spread
            chain.push.apply(chain, responseInterceptorChain);
            len = chain.length;

            promise = Promise.resolve(config);

            while (i < len) {
                promise = promise.then(chain[i++], chain[i++]);
            }

            return promise;
        }

        len = requestInterceptorChain.length;

        let newConfig = config;

        i = 0;

        while (i < len) {
            const onFulfilled = requestInterceptorChain[i++];
            const onRejected = requestInterceptorChain[i++];
            try {
                newConfig = onFulfilled(newConfig);
            } catch (error) {
                onRejected.call(this, error);
                break;
            }
        }

        try {
            promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
            return Promise.reject(error);
        }

        i = 0;
        len = responseInterceptorChain.length;

        while (i < len) {
            promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }

        return promise;
    }
}

export default Request;