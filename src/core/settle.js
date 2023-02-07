import RequestError from './RequestError';

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
export default function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
        response.request = null;
        response.config = null;
        delete response.request;
        delete response.config;
        delete response.status;
        delete response.statusText;
        resolve(response);
    } else {
        reject(new RequestError(
            `Request failed with status code ${response.status}`,
            [RequestError.ERR_BAD_REQUEST, RequestError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
            response.config,
            response.request,
            response,
        ));
    }
}
