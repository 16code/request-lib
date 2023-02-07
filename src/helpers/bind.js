export default function bind(fn, thisArg) {
    return function wrap() {
        // eslint-disable-next-line prefer-rest-params
        return fn.apply(thisArg, arguments);
    };
}
  