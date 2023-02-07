import utils from '../utils';
import RequestURLSearchParams from './RequestURLSearchParams';
const PROTOCOL_AND_IPV6_REGEX = /^https?:\/\/\[[^\]]*][^/]*/;
function encodeUriSegment(val) {
    return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
}
export function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
}
function fillUriParams(url, params) {
    let protocolAndIpv6 = '';
    let val;
    let encodedVal;

    const urlParams = Object.create(null);
    utils.forEach(url.split(/\W/), function (param) {
        if (!new RegExp('^\\d+$').test(param) && param && new RegExp(`(^|[^\\\\]):${param}(\\W|$)`).test(url)) {
            urlParams[param] = {
                isQueryParamValue: new RegExp(`\\?.*=:${param}(?:\\W|$)`).test(url),
            };
        }
    });

    url = url.replace(/\\:/g, ':');
    url = url.replace(PROTOCOL_AND_IPV6_REGEX, function (match) {
        protocolAndIpv6 = match;
        return '';
    });

    utils.forEach(urlParams, function (paramInfo, urlParam) {
        // console.log(paramInfo, urlParam);
        // eslint-disable-next-line no-prototype-builtins
        val = params.hasOwnProperty(urlParam) && params[urlParam];
        if (val) {
            if (paramInfo.isQueryParamValue) {
                encodedVal = encodeUriQuery(val, false);
            } else {
                encodedVal = encodeUriSegment(val);
            }
            url = url.replace(new RegExp(`:${urlParam}(\\W|$)`, 'g'), function (match, p1) {
                return encodedVal + p1;
            });
        } else {
            url = url.replace(new RegExp(`(/?):${urlParam}(\\W|$)`, 'g'), function (match, leadingSlashes, tail) {
                if (tail.charAt(0) === '/') {
                    return tail;
                }
                return leadingSlashes + tail;
            });
        }
    });
    url = url.replace(/\/+$/, '') || '/';
    url = protocolAndIpv6 + url.replace(/\/(\\|%5C)\./, '/.');
    const newParams = {};
    utils.forEach(params, function (value, key) {
        if (!urlParams[key]) {
            newParams[key] = value;
        }
    });
    return { url, params: newParams };
}
export default function buildURL(configUrl, configParams, options) {
    // eslint-disable-next-line prefer-const
    let { url, params } = fillUriParams(configUrl, configParams);
    if (!configParams) return url;

    // eslint-disable-next-line no-underscore-dangle, no-mixed-operators
    const encode = options && options.encode || encodeUriQuery;
    const serializeFn = options && options.serialize;

    let serializedParams;
    if (serializeFn) {
        serializedParams = serializeFn(params, options);
    } else {
        serializedParams = utils.isURLSearchParams(params) ?
            params.toString() :
            new RequestURLSearchParams(params, options).toString(encode);
    }

    if (serializedParams) {
        const hashmarkIndex = url.indexOf('#');

        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
}