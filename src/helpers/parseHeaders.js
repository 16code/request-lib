import utils from '../utils';

const ignoreDuplicateOf = utils.toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent',
]);

export default rawHeaders => {
    const parsed = {};
    let key;
    let val;
    let i;

    rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
        i = line.indexOf(':');
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();

        if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
            return;
        }

        if (key === 'set-cookie') {
            if (parsed[key]) {
                parsed[key].push(val);
            } else {
                parsed[key] = [val];
            }
        } else {
            parsed[key] = parsed[key] ? `${parsed[key]}, ${val}` : val;
        }
    });

    return parsed;
};
