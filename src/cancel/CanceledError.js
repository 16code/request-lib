import RequestError from '../core/RequestError';
import utils from '../utils';

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    RequestError.call(this, message == null ? 'canceled' : message, RequestError.ERR_CANCELED, config, request);
    this.name = 'CanceledError';
}

utils.inherits(CanceledError, RequestError, {
    __CANCEL__: true,
});

export default CanceledError;