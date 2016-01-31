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
class AssertionResult {
    constructor(_unitTestID, _successful, _description) {
        this._unitTestID = _unitTestID;
        this._successful = _successful;
        this._description = _description;
    }
    get unitTestID() {
        return this._unitTestID;
    }
    get successful() {
        return this._successful;
    }
    get description() {
        return this._description;
    }
}
exports.AssertionResult = AssertionResult;