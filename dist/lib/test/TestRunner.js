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
var UnitTest_1 = require('./UnitTest');
var UnitTestState_1 = require('./UnitTestState');
var util = require('../util/Event');
class TestRunner extends UnitTest_1.UnitTest {
    constructor() {
        super(...arguments);
        this.onChildStart = new util.Event();
        this.onChildFinish = new util.Event();
        this.onChildReset = new util.Event();
        this._tests = [];
    }
    /**
     * Returns a test runner child class that will run a list of unit tests.
     * @param tests The unit test instances or test classes to run.
     * @example
     *     class SampleUnitTest extends UnitTest {
     *         // ...
     *     }
     *
     *     class SampleTestRunner extends TestRunner.runs(SampleUnitTest, new SampleUnitTest()) { }
     *
     *     var runner = new SampleTestRunner();
     *     runner.run(); // will run `SampleUnitTest`
     */
    static runs() {
        for (var _len = arguments.length, tests = Array(_len), _key = 0; _key < _len; _key++) {
            tests[_key] = arguments[_key];
        }

        return class extends this {
            constructor() {
                super();
                this.add(...tests.map(testClass => {
                    if (testClass instanceof UnitTest_1.UnitTest) {
                        return testClass;
                    } else {
                        return new testClass();
                    }
                }));
            }
        };
    }
    get timesOutAfter() {
        var ms = 0;
        this._tests.forEach(test => {
            ms += test.timesOutAfter;
        });
        return Math.max(ms, 1);
    }
    set timesOutAfter(ms) {
        // don't do anything
    }
    get tests() {
        return [].concat(this._tests);
    }
    add() {
        for (var _len2 = arguments.length, tests = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            tests[_key2] = arguments[_key2];
        }

        tests.forEach(test => {
            // only add listeners if the test was not added before (this avoids triggering child events multiple
            // times for the same unit test instance)
            if (this._tests.indexOf(test) === -1) {
                test.onStart.bind(() => this.onChildStart.trigger(test));
                test.onFinish.bind(() => this.onChildFinish.trigger(test));
                test.onReset.bind(() => this.onChildReset.trigger(test));
            }
            this._tests.push(test);
        });
    }
    getAllTestsAndChildTests() {
        var tests = [];
        this._tests.forEach(test => {
            tests.push(test);
            if (test instanceof TestRunner) tests = tests.concat(test.tests);
        });
        return tests;
    }
    /**
     * @override
     */
    reset() {
        this._tests.forEach(test => test.reset());
        super.reset();
    }
    /**
     * @override
     */
    performTest() {
        return __awaiter(this, void 0, _promise2.default, function* () {
            for (let i = 0; i < this._tests.length; i++) {
                const test = this._tests[i];
                test.state = UnitTestState_1.UnitTestState.Scheduled;
                yield this.assert(test, "Test '" + test.name + "'");
                yield this.afterAssert(test);
            }
        });
    }
    /**
     * A method that is called after a unit test was run.
     * @param test The test that has just finished.
     */
    afterAssert(test) {
        return __awaiter(this, void 0, _promise2.default, function* () {});
    }
}
exports.TestRunner = TestRunner;