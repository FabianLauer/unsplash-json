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
var net = require('../net');
/**
 * Unsplash API client.
 */
class Client {
    /**
     * Creates an API client object.
     */
    constructor(credentials, accessToken) {
        this.credentials = credentials;
        this.accessToken = accessToken;
        /**
         * The HTTP client. The created client supports whatever is available in the current environment (either `XMLHttpRequest` or node HTTP requests).
         */
        this.httpClient = net.HttpClient.createForCurrentEnvironment('api.unsplash.com', true);
        /**
         * The default headers sent with every request.
         */
        this.defaultHeaders = {
            Authorization: undefined
        };
        this.setupDefaultAuthorizationHeaders();
    }
    /**
     * The maximum number of requests that can be made by the client to the unsplash API every hour.
     */
    getHourlyRateLimit() {
        return this.hourlyRatelimit;
    }
    /**
     * The maximum number of requests that can be made by the client to the unsplash API in the current hour.
     */
    getRemainingHourlyRateLimit() {
        return this.remainingHourlyRateLimit;
    }
    /**
     * Sends an HTTP request to the unsplash API and returns the response as an object.
     * @param urlPath The path (relative to the unsplash API's hostname) to send the request to.
     * @param method The HTTP method to send the request with. Optional, defaults to GET.
     * @param params A key->value map that holds the parameters to send along with the request. Optional.
     * @param additionalHeaders A key->value map that holds request headers to send. These headers might be overridden by the client instance's default headers.
     */
    sendRequest(urlPath, method, params, additionalHeaders) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            if (!net.HttpClient.isValidHttpMethod(method)) {
                method = 1 /* Get */;
            }
            const response = yield this.httpClient.sendRequest(urlPath, method, params, this.mergeHeadersWithDefaultHeaders(additionalHeaders));
            this.processCompletedHttpRequest();
            return response;
        });
    }
    /**
     * This sets up all default headers required to authorize the client instance. Called only by the constructor *once* per instance.
     */
    setupDefaultAuthorizationHeaders() {
        // see https://unsplash.com/documentation#public-actions for the exact format of the 'Authorization' header:
        this.defaultHeaders.Authorization = 'Client-ID ' + this.credentials.applicationId;
    }
    /**
     * Merges a header object with the default headers of this client instance. The default headers override header fields of the `additionalHeaders` parameter if they have the same name.
     * @param additionalHeaders The header object to merge with the default headers. Optional. If omitted, an object containing the same values as the client's default headers will be returned.
     * @return Always returns an object, regardless of the parameter(s).
     */
    mergeHeadersWithDefaultHeaders(additionalHeaders) {
        if (typeof additionalHeaders !== 'object' || additionalHeaders === null) {
            additionalHeaders = {};
        }
        for (let name in this.defaultHeaders) {
            additionalHeaders[name] = this.defaultHeaders[name];
        }
        return additionalHeaders;
    }
    /**
     * Called by `sendRequest(...)` after every completed HTTP request to gather info on the request/response pair.
     */
    processCompletedHttpRequest() {
        // rate limit headers (https://unsplash.com/documentation#rate-limiting):
        this.hourlyRatelimit = parseInt(this.httpClient.getResponseHeaderFromLastRequest('X-Ratelimit-Limit'), 10);
        this.remainingHourlyRateLimit = parseInt(this.httpClient.getResponseHeaderFromLastRequest('X-Ratelimit-Remaining'), 10);
    }
}
exports.Client = Client;