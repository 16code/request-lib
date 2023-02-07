
import utils from '../utils';

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function RequestError(message, code, config, request, response) {
    Error.call(this);

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = (new Error()).stack;
    }

    this.message = message;
    this.name = 'RequestError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
}

utils.inherits(RequestError, Error, {
    toJSON: function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Request
            config: utils.toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null,
        };
    },
});

const prototype = RequestError.prototype;
const descriptors = {};

[
    'ERR_BAD_OPTION_VALUE',
    'ERR_BAD_OPTION',
    'ECONNABORTED',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_FR_TOO_MANY_REDIRECTS',
    'ERR_DEPRECATED',
    'ERR_BAD_RESPONSE',
    'ERR_BAD_REQUEST',
    'ERR_CANCELED',
    'ERR_NOT_SUPPORT',
    'ERR_INVALID_URL',
// eslint-disable-next-line func-names
].forEach(code => {
    descriptors[code] = { value: code };
});

Object.defineProperties(RequestError, descriptors);
Object.defineProperty(prototype, 'isRequestError', { value: true });

// eslint-disable-next-line func-names
RequestError.from = (error, code, config, request, response, customProps) => {
    const requestError = Object.create(prototype);

    utils.toFlatObject(error, requestError, function filter(obj) {
        return obj !== Error.prototype;
    }, prop => prop !== 'isRequestError');

    RequestError.call(requestError, error.message, code, config, request, response);

    requestError.cause = error;

    requestError.name = error.name;

    customProps && Object.assign(requestError, customProps);

    return requestError;
};

export default RequestError;
