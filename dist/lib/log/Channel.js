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
/**
 * Enumerates log channels.
 */
(function (Channel) {
    Channel[Channel["Debug"] = 0] = "Debug";
    Channel[Channel["Notice"] = 1] = "Notice";
    Channel[Channel["Query"] = 2] = "Query";
    Channel[Channel["Network"] = 3] = "Network";
    Channel[Channel["Warn"] = 4] = "Warn";
    Channel[Channel["Error"] = 5] = "Error";
})(exports.Channel || (exports.Channel = {}));
var Channel = exports.Channel;