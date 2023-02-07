import RequestURLSearchParams from '../../../helpers/RequestURLSearchParams';
export default typeof URLSearchParams !== 'undefined' ? URLSearchParams : RequestURLSearchParams;
