export default function spread(callback) {
    return function wrap(arr) {
        // eslint-disable-next-line prefer-spread
        return callback.apply(null, arr);
    };
}
  