export default function isCancel(value) {
    // eslint-disable-next-line no-underscore-dangle
    return !!(value && value.__CANCEL__);
}
  