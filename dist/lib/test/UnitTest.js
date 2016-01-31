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
var AssertionResult_1 = require('./AssertionResult');
var UnitTestState_1 = require('./UnitTestState');
var util = require('../util/Event');
/**
 * Abstract base class for unit tests.
 */
class UnitTest {
    constructor() {
        this.state = UnitTestState_1.UnitTestState.Idle;
        this.timesOutAfter = this.constructor.defaultTimeout;
        this.assertionResults = [];
        this.onStart = new util.Event();
        this.onFinish = new util.Event();
        this.onReset = new util.Event();
        this.id = ++UnitTest.instanceCounter;
        this.resultTarget = this;
    }
    static testName(name) {
        return target => {
            target._testName = name;
        };
    }
    static describe() {
        for (var _len = arguments.length, description = Array(_len), _key = 0; _key < _len; _key++) {
            description[_key] = arguments[_key];
        }

        return target => {
            target.description = description.join('');
        };
    }
    static timeout(milliseconds) {
        return target => {
            target.defaultTimeout = milliseconds;
        };
    }
    static tests() {
        return target => {};
    }
    /**
     * @final
     */
    get ID() {
        return this.id;
    }
    get name() {
        return this.constructor._testName || this.constructor.name || '???';
    }
    get description() {
        return this.constructor.description || "unit test " + this.name;
    }
    /**
     * What features, functions, classes, methods, etc are tested by a unit test.
     */
    get tests() {
        return [];
    }
    reset() {
        this.state = UnitTestState_1.UnitTestState.Scheduled;
        this.assertionResults.splice(0, this.assertionResults.length);
        this.startTime = null;
        this.stopTime = null;
        this.execTime = null;
        this.exception = null;
        this.onReset.trigger();
    }
    run() {
        return new _promise2.default(resolve => __awaiter(this, void 0, _promise2.default, function* () {
            var timedOut = false;
            this.onStart.trigger();
            this.state = UnitTestState_1.UnitTestState.Running;
            this.startTimer();
            setTimeout(() => {
                if (this.state === UnitTestState_1.UnitTestState.Running) {
                    timedOut = true;
                    this.stopTimer();
                    this.interpretResultsWithTimeout();
                    this.onFinish.trigger();
                    resolve();
                }
            }, this.timesOutAfter);
            this.performTest().then(() => {
                this.stopTimer();
                if (timedOut) return;
                this.interpretResults();
                this.onFinish.trigger();
                return resolve();
            }).catch(err => {
                this.stopTimer();
                if (timedOut) return;
                // the test failed, so update the status and store the exception
                this.interpretResultsWithUncaughtException(err);
                this.onFinish.trigger();
                return resolve();
            });
        }));
    }
    /**
     * @final
     */
    static __isUnitTestClass(object) {
        return typeof object === 'function' && object.__unitTestBrand__ === UnitTest.__unitTestBrand__;
    }
    assert(test) {
        for (var _len2 = arguments.length, description = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            description[_key2 - 1] = arguments[_key2];
        }

        return __awaiter(this, void 0, _promise2.default, function* () {
            return new _promise2.default(done => __awaiter(this, void 0, _promise2.default, function* () {
                var actualResult;
                if (this.state === UnitTestState_1.UnitTestState.Timeout) return;
                switch (true) {
                    default:
                        throw new Error(`UnitTest.prototype.Assert(...): Invalid assertion test type ${ test ? test.constructor.name : typeof test }.`);
                    case typeof test === "boolean":
                        actualResult = !!test;
                        this.interpretActualAssertionResult(actualResult, description);
                        done(actualResult);
                        break;
                    case test instanceof _promise2.default:
                        test.then(result => {
                            actualResult = !!result;
                            this.interpretActualAssertionResult(actualResult, description);
                            done(actualResult);
                        });
                        break;
                    case test instanceof UnitTest:
                        (() => __awaiter(this, void 0, _promise2.default, function* () {
                            yield test.run();
                            actualResult = test.state === UnitTestState_1.UnitTestState.Successful;
                            this.interpretActualAssertionResult(actualResult, description);
                            done(actualResult);
                        }))();
                        break;
                    case UnitTest.__isUnitTestClass(test):
                        const testInstance = new test();
                        (() => __awaiter(this, void 0, _promise2.default, function* () {
                            yield testInstance.runInContext(this);
                            actualResult = testInstance.state === UnitTestState_1.UnitTestState.Successful;
                            this.interpretActualAssertionResult(actualResult, description);
                            done(actualResult);
                        }))();
                        break;
                }
            }));
        });
    }
    runInContext(test) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            this.resultTarget = test;
            yield this.run();
            this.resultTarget = this;
        });
    }
    interpretResultsWithUncaughtException(err) {
        if (this.state === UnitTestState_1.UnitTestState.Timeout) return;
        this.state = UnitTestState_1.UnitTestState.Error;
        this.exception = err;
    }
    interpretResultsWithTimeout() {
        this.state = UnitTestState_1.UnitTestState.Timeout;
    }
    interpretResults() {
        if (this.state === UnitTestState_1.UnitTestState.Timeout) return;
        if (this.assertionResults && this.assertionResults.length > 0) {
            let failedAssertions = this.assertionResults.filter(result => !result.successful).length;
            if (failedAssertions > 0) this.state = UnitTestState_1.UnitTestState.Fail;else this.state = UnitTestState_1.UnitTestState.Successful;
        } else {
            this.state = UnitTestState_1.UnitTestState.Indeterminate;
        }
    }
    interpretActualAssertionResult(result, description) {
        if (this.state === UnitTestState_1.UnitTestState.Running) {
            this.resultTarget.assertionResults = this.resultTarget.assertionResults || [];
            this.resultTarget.assertionResults.push(new AssertionResult_1.AssertionResult(this.id, result, description.join(" ")));
        }
    }
    startTimer() {
        if (this.startTime instanceof Date) return;
        this.startTime = new Date();
    }
    stopTimer() {
        if (this.stopTime instanceof Date) return;
        this.stopTime = new Date();
        if (this.startTime instanceof Date) this.execTime = this.stopTime.getTime() - this.startTime.getTime();
    }
    get stateAsString() {
        return UnitTestState_1.UnitTestState[this.state];
    }
}
UnitTest.__unitTestBrand__ = Math.random();
UnitTest.instanceCounter = 0;
UnitTest.defaultTimeout = 200;
exports.UnitTest = UnitTest;