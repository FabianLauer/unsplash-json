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
var AbstractHttpClient_1 = require('./AbstractHttpClient');
class XmlHttpClient extends AbstractHttpClient_1.AbstractHttpClient {
    /**
     * Sends a request and returns the response as an object.
     * @param urlPath The path (relative to the client's hostname) to send the request to.
     * @param method The HTTP method to send the request with.
     * @param params A key->value map that holds the parameters to send along with the request.
     * @param headers A key->value map that holds request headers to be sent.
     */
    sendRequestConcrete(urlPath, method, params, headers) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const request = new XMLHttpRequest(),
                  requestPromise = this.waitForRequestComplete(request);
            // set all headers
            if (typeof headers === 'object' && headers !== null) {
                for (let name in headers) {
                    request.setRequestHeader(name, headers[name]);
                }
            }
            // open and send the request
            request.open(AbstractHttpClient_1.AbstractHttpClient.httpMethodToString(method), this.generateFullUrl(urlPath), true);
            request.send(params);
            // wait for the request to finish
            yield requestPromise;
            this.storeAllResponseHeaders(request);
            return JSON.parse(request.responseText);
        });
    }
    waitForRequestComplete(request) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return new _promise2.default((resolve, reject) => {
                request.addEventListener('readystatechange', () => {
                    if (request.readyState === 4) {
                        resolve();
                    }
                });
                request.addEventListener('error', event => reject(event));
                request.addEventListener('abort', event => reject(event));
            });
        });
    }
    storeAllResponseHeaders(request) {
        /// TODO: Implement this!
    }
}
exports.XmlHttpClient = XmlHttpClient;