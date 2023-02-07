import URLSearchParams from './classes/URLSearchParams.js';
import FormData from './classes/FormData.js';

export default {
    isNode: true,
    classes: {
        URLSearchParams,
        FormData,
        // eslint-disable-next-line no-mixed-operators
        Blob: typeof Blob !== 'undefined' && Blob || null,
    },
    protocols: ['http', 'https', 'file', 'data'],
};
