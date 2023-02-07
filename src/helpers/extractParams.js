import utils from '../utils';

export default function extractParams(data, params) {
    const ids = {};
    function parserParams (value, key) {
        if (utils.isFunction(value)) {
            value = value(data);
        }
        ids[key] = value && value.charAt && value.charAt(0) === '@' ? lookupDottedPath(data, value.substr(1)) : value;
    }
    if (utils.isString(data) && utils.isJsonLike(data)) {      
        data = JSON.parse(data);
        if (utils.isURLSearchParams(params)) {
            params.forEach(parserParams);
        } else {
            utils.forEach(params, parserParams);
        }
    }
    if (utils.isHTMLForm(params)) {
        const p = new FormData(params);
        p.forEach(parserParams);
    } else if (utils.isFormData(params)) {
        params.forEach(parserParams);
    } else if (utils.isObject(params)) {
        utils.forEach(params, parserParams);
    }
    return ids;
}

function lookupDottedPath(obj, path) {
    if (!isValidDottedPath(path)) {
        throw Error('Dotted member path "@{0}" is invalid.', path);
    }
    const keys = path.split('.');
    for (let i = 0, ii = keys.length; i < ii && obj; i++) {
        const key = keys[i];
        obj = obj !== null ? obj[key] : undefined;
    }
    return obj;
}
const MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;
function isValidDottedPath(path) {
    return path && path !== '' && path !== 'hasOwnProperty' && MEMBER_NAME_REGEX.test(`.${path}`);
}
