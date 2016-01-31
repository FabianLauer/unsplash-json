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
/// <reference path="../../typings/node" />
var http = require('http');
var https = require('https');
var qs = require('querystring');
var AbstractHttpClient_1 = require('./AbstractHttpClient');
class NodeHttpClient extends AbstractHttpClient_1.AbstractHttpClient {
    /**
     * Sends a request and returns the response as an object.
     * @param urlPath The path (relative to the client's hostname) to send the request to.
     * @param method The HTTP method to send the request with.
     * @param params A key->value map that holds the parameters to send along with the request.
     * @param headers A key->value map that holds request headers to be sent.
     */
    sendRequestConcrete(urlPath, method, params, headers) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const responseText = yield this.sendNodeRequest(urlPath, method, params, headers);
            return JSON.parse(responseText);
        });
    }
    /**
     * Returns the request module (either node's `http` or `https` module) to use, depending on whether this http client uses HTTPS or plain HTTP.
     */
    getRequestModule() {
        if (this.getUseHttps()) {
            return https;
        } else {
            return http;
        }
    }
    /**
     * Sends a node.js request and returns a promise that is resolved with the complete response text as soon as the request has completed.
     */
    sendNodeRequest(urlPath, method, params, headers) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return new _promise2.default((resolve, reject) => {
                const request = this.getRequestModule().request(this.createRequestOptions(urlPath, method, params, headers), response => {
                    var responseText = '';
                    response.on('data', chunk => {
                        responseText += chunk;
                    });
                    response.on('end', () => {
                        this.storeAllResponseHeaders(response);
                        resolve(responseText);
                    });
                });
                request.on('error', err => {
                    reject(err);
                });
                request.end();
            });
        });
    }
    /**
     * Creates a request options object for a certain request configuration.
     */
    createRequestOptions(urlPath, method, params, headers) {
        return {
            method: AbstractHttpClient_1.AbstractHttpClient.httpMethodToString(method).toUpperCase(),
            hostname: this.getHostName(),
            path: urlPath + '?' + qs.stringify(params),
            headers: headers
        };
    }
    /**
     * Stores response headers so that users of this class can access them.
     */
    storeAllResponseHeaders(response) {
        for (let name in response.headers) {
            this.setResponseHeaderFromLastRequest(name, response.headers[name]);
        }
    }
}
exports.NodeHttpClient = NodeHttpClient;