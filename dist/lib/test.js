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
var UnitTestState_1 = require('./test/UnitTestState');
exports.UnitTestState = UnitTestState_1.UnitTestState;
var AssertionResult_1 = require('./test/AssertionResult');
exports.AssertionResult = AssertionResult_1.AssertionResult;
var UnitTest_1 = require('./test/UnitTest');
exports.UnitTest = UnitTest_1.UnitTest;
var TestRunner_1 = require('./test/TestRunner');
exports.TestRunner = TestRunner_1.TestRunner;
var CliRenderer_1 = require('./test/CliRenderer');
exports.CliRenderer = CliRenderer_1.CliRenderer;