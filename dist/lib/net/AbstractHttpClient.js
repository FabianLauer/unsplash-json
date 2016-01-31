"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) {
            return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) {
                resolve(value);
            });
        }
        function onfulfill(value) {
            try {
                step("next", value);
            } catch (e) {
                reject(e);
            }
        }
        function onreject(value) {
            try {
                step("throw", value);
            } catch (e) {
                reject(e);
            }
        }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
/**
 * HTTP client objects can send requests to a host and return the response. For simplicity, they only support one host name at a time, which has to be set when the client object is created. This avoids having to add the host name to every call against the `sendRequest` method.
 */
class AbstractHttpClient {
    /**
     * Creates a HTTP client object.
     * @param hostname The name of the host to send requests to, such as a domain name or IP.
     * @param useHttps Whether to send requests to the host via HTTPS or plain HTTP. When `true`, the client will use HTTPS.
     */
    constructor(hostname, useHttps) {
        this.hostname = hostname;
        this.useHttps = useHttps;
        /**
         * Holds the response headers of the last request made as a key->value map. **Keys written to this object MUST be lowercase**.
         */
        this.lastResponseHeaders = {};
        this.hostname = AbstractHttpClient.normalizeHostname(hostname);
        this.useHttps = !!useHttps;
    }
    /**
     * Returns `true` if the http client uses HTTPS, `false` if it uses HTTP.
     */
    getUseHttps() {
        return this.useHttps;
    }
    /**
     * Returns the hostname this http client sends requests to.
     */
    getHostName() {
        return this.hostname;
    }
    /**
     * Checks whether a value is a valid `HttpMethod` enum value.
     * @param method The value to check.
     */
    static isValidHttpMethod(method) {
        switch (method) {
            case 1 /* Get */:
            case 2 /* Post */:
            case 3 /* Put */:
            case 4 /* Delete */:
                return true;
            default:
                return false;
        }
    }
    /**
     * Sends a request and returns the response as an object.
     * @param urlPath The path (relative to the client's hostname) to send the request to.
     * @param method The HTTP method to send the request with.
     * @param params A key->value map that holds the parameters to send along with the request.
     * @param headers A key->value map that holds request headers to be sent.
     */
    sendRequest(urlPath, method, params, headers) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            /// TODO: Reject requests to this method if this client is still requesting information.
            this.clearLastResponseHeaders();
            return this.sendRequestConcrete(this.ensureIsJustUrlPath(urlPath), method, params, headers);
        });
    }
    /**
     * Returns a response header value from the last request that was made. Returns `undefined` if no header field with this name exists or if no requests were made yet.
     * @param headerName The name of the header to get. This is **case insensitive**.
     */
    getResponseHeaderFromLastRequest(headerName) {
        return this.lastResponseHeaders[headerName.toLowerCase()];
    }
    /**
     * Returns the http client's protocol as a string.
     */
    getProtocolString() {
        return this.useHttps ? 'https' : 'http';
    }
    /**
     * Generates a full URL containing the hostname and a normalized url path.
     * @param urlPath The url path to append to the client's hostname. The url path will be normalized.
     */
    generateFullUrl(urlPath) {
        return this.hostname + AbstractHttpClient.normalizeUrlPath(urlPath);
    }
    /**
     * Stores a response header.
     * @param headerName The name of the header.
     * @param headerValue The header's value.
     */
    setResponseHeaderFromLastRequest(headerName, headerValue) {
        this.lastResponseHeaders[headerName.toLowerCase()] = headerValue;
    }
    /**
     * Converts a `HttpMethod` enum value to a string.
     * @param method The `HttpMethod` enum value to convert to a string.
     */
    static httpMethodToString(method) {
        switch (method) {
            case 1 /* Get */:
                return 'get';
            case 2 /* Post */:
                return 'post';
            case 3 /* Put */:
                return 'put';
            case 4 /* Delete */:
                return 'delete';
        }
    }
    /**
     * Checks whether `XMLHttpRequest` is supported.
     */
    static supportsXmlHttp() {
        return typeof XMLHttpRequest === 'function';
    }
    /**
     * Normalizes a host name.
     */
    static normalizeHostname(baseUrl) {
        return baseUrl.replace(/\/+$/, '');
    }
    /**
     * Normalizes a URL path.
     */
    static normalizeUrlPath(urlPath) {
        return ('/' + (urlPath || '')).replace(/\/+/g, '/');
    }
    /**
     * Ensures that a url string only contains the url path, but not the base url of this http client.
     * @example
     *     const client = new AbstractHttpClient('example.com', true);
     *     console.log(client.ensureIsJustUrlPath('/foo/bar')); // nothing to remove, logs 'foo/bar'
     *     console.log(client.ensureIsJustUrlPath('example.com/foo/bar')); // base url is removed, also logs 'foo/bar'
     */
    ensureIsJustUrlPath(url) {
        return AbstractHttpClient.normalizeUrlPath(url.replace(new RegExp('^(http(s)?\:\/\/)?' + this.hostname), ''));
    }
    /**
     * Converts a key->value object to a query string.
     */
    paramObjectToQueryString(params) {
        var queryString = '';
        for (let key in params) {
            queryString += `${ key }=${ params[key] }`;
        }
        return queryString;
    }
    /**
     * Resets the `lastResponseHeaders` property. Called before every request send with `sendRequest`.
     */
    clearLastResponseHeaders() {
        for (let name in this.lastResponseHeaders) {
            delete this.lastResponseHeaders[name];
        }
    }
}
exports.AbstractHttpClient = AbstractHttpClient;