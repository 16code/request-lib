import utils from '../utils';
import platform from '../platform';

export default platform.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
    (function standardBrowserEnv() {
        return {
            write: function write(name, value, expires, path, domain, secure) {
                const cookie = [];
                cookie.push(`${name}=${encodeURIComponent(value)}`);

                if (utils.isNumber(expires)) {
                    cookie.push(`expires=${new Date(expires).toGMTString()}`);
                }

                if (utils.isString(path)) {
                    cookie.push(`path=${path}`);
                }

                if (utils.isString(domain)) {
                    cookie.push(`domain=${domain}`);
                }

                if (secure === true) {
                    cookie.push('secure');
                }

                document.cookie = cookie.join('; ');
            },

            read: function read(name) {
                const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
                return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
                this.write(name, '', Date.now() - 86400000);
            },
        };
    })() :

// Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
        return {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            write: function write() {},
            read: function read() {
                return null; 
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            remove: function remove() {},
        };
    })();
