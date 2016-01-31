"use strict";

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
var NodeHttpClient_1 = require('./NodeHttpClient');
var XmlHttpClient_1 = require('./XmlHttpClient');
class HttpClient extends AbstractHttpClient_1.AbstractHttpClient {
    /**
     * Creates a HTTP client that works in the current environment.
     */
    static createForCurrentEnvironment(baseUrl, useHttps) {
        if (HttpClient.supportsXmlHttp()) {
            return new XmlHttpClient_1.XmlHttpClient(baseUrl, useHttps);
        } else {
            return new NodeHttpClient_1.NodeHttpClient(baseUrl, useHttps);
        }
    }
}
exports.HttpClient = HttpClient;