import utils from '../utils';
import defaults from '../defaults';
import RequestHeaders from './RequestHeaders';

export default function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = RequestHeaders.from(context.headers);
    let data = context.data;
  
    utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });
  
    headers.normalize();
  
    return data;
}
