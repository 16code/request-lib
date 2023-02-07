import utils from '../utils';
import toFormData from './toFormData';
import platform from '../platform/index.js';

export default function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor(value, key, path, helpers) {
            if (platform.isNode && utils.isBuffer(value)) {
                this.append(key, value.toString('base64'));
                return false;
            }

            // eslint-disable-next-line prefer-rest-params
            return helpers.defaultVisitor.apply(this, arguments);
        },
    }, options));
}
