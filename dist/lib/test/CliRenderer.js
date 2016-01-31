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
var UnitTestState_1 = require('./UnitTestState');
var UnitTest_1 = require('./UnitTest');
var TestRunner_1 = require('./TestRunner');
var Message_1 = require('../log/Message');
var Channel_1 = require('../log/Channel');
var Writer_1 = require('../log/Writer');
const FG_DEFAULT = '\x1b[39m',
      FG_GREEN = '\x1b[32m',
      FG_RED = '\x1b[31m',
      FG_YELLOW = '\x1b[33m',
      WEIGHT_NORMAL = '\x1b[0m',
      WEIGHT_BOLD = '\x1b[1m',
      INDENT = '\t';
function colorize(literals, placeholders, color) {
    var result = color;
    placeholders.forEach((placeholder, index) => {
        result += literals[index] + placeholder;
    });
    result += literals[literals.length - 1];
    return result + FG_DEFAULT;
}
function red(literals) {
    for (var _len = arguments.length, placeholders = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        placeholders[_key - 1] = arguments[_key];
    }

    return colorize(literals, placeholders, FG_RED);
}
function green(literals) {
    for (var _len2 = arguments.length, placeholders = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        placeholders[_key2 - 1] = arguments[_key2];
    }

    return colorize(literals, placeholders, FG_RED);
}
function yellow(literals) {
    for (var _len3 = arguments.length, placeholders = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        placeholders[_key3 - 1] = arguments[_key3];
    }

    return colorize(literals, placeholders, FG_YELLOW);
}
class TestMessage extends Message_1.Message {
    toString() {
        return `${ this.getText() }`;
    }
}
/**
 * Command line rendering for unit tests and unit test runners.
 */
class CliRenderer extends Writer_1.Writer {
    /**
     * Creates a command line renderer for a unit test or test runner. Immediately starts listening to unit test events.
     * @param topLevelTest An instance of `UnitTest` or `TestRunner`.
     */
    constructor(test) {
        super();
        this.test = test;
        this.depthLevel = 0;
        this.initDeepRenderers();
        this.bindEventListeners();
    }
    createMessage(channel, messageText) {
        return TestMessage.createWithText(messageText).setChannel(channel);
    }
    initDeepRenderers() {
        if (this.test instanceof UnitTest_1.UnitTest) {
            this.test.tests.forEach(test => this.createChildRenderer(test));
        }
    }
    createChildRenderer(test) {
        const renderer = new CliRenderer(test);
        renderer.depthLevel = this.depthLevel + 1;
        renderer.pipeLogMessagesTo(this);
    }
    bindEventListeners() {
        this.test.onFinish.bind(() => this.renderTestFinished());
        if (this.test instanceof TestRunner_1.TestRunner) {
            this.test.onStart.bind(() => this.renderTestRunnerStarting());
        }
    }
    getIndentString() {
        var str = '';
        for (let i = 0; i < this.depthLevel; i++) {
            str += INDENT;
        }
        return str;
    }
    static formatTestName(testName) {
        return `${ WEIGHT_BOLD }${ testName }${ WEIGHT_NORMAL }`;
    }
    getFormattedTestName() {
        return CliRenderer.formatTestName(this.test.name);
    }
    write(channel) {
        for (var _len4 = arguments.length, message = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            message[_key4 - 1] = arguments[_key4];
        }

        this.logMessage(channel, this.getIndentString(), ...message);
    }
    renderTestRunnerStarting() {
        const line = '---------------';
        this.write(Channel_1.Channel.Notice, `${ line } Running ${ this.getFormattedTestName() } ${ line }`);
    }
    static getStateSymbol(state) {
        switch (state) {
            default:
                return '?';
            case UnitTestState_1.UnitTestState.Successful:
                return '✓';
            case UnitTestState_1.UnitTestState.Fail:
                return '✗';
            case UnitTestState_1.UnitTestState.Error:
                return '!';
            case UnitTestState_1.UnitTestState.Timeout:
                return '⌬';
        }
    }
    static getStateColor(state) {
        switch (state) {
            default:
                return FG_DEFAULT;
            case UnitTestState_1.UnitTestState.Successful:
                return FG_GREEN;
            case UnitTestState_1.UnitTestState.Fail:
            case UnitTestState_1.UnitTestState.Error:
            case UnitTestState_1.UnitTestState.Timeout:
                return FG_RED;
        }
    }
    getStateSymbol() {
        return CliRenderer.getStateSymbol(this.test.state);
    }
    getStateColor() {
        return CliRenderer.getStateColor(this.test.state);
    }
    getFormattedStateSymbol() {
        return `${ this.getStateColor() }${ WEIGHT_BOLD }${ CliRenderer.getStateSymbol(this.test.state) }${ WEIGHT_NORMAL }${ FG_DEFAULT } `;
    }
    getTestRunnerStatistics() {
        const byState = {},
              NEWLINE = `\n${ this.getIndentString() }${ INDENT }`;
        var str = '';
        this.test.getAllTestsAndChildTests().forEach(test => {
            byState[test.state] = byState[test.state] || 0;
            byState[test.state] += 1;
        });
        for (let state in byState) {
            str += `${ NEWLINE }${ UnitTestState_1.UnitTestState[state] }: ${ byState[state] }`;
        }
        return `${ str }${ NEWLINE }Time: ${ this.test.execTime / 1000 }s`;
    }
    renderTestFinished() {
        const NEWLINE = `\n${ this.getIndentString() }${ INDENT }`,
              line = '---------------';
        var channel,
            additionalMessage = '',
            assertionMessage = '';
        switch (this.test.state) {
            default:
            case UnitTestState_1.UnitTestState.Fail:
                channel = Channel_1.Channel.Warn;
                break;
            case UnitTestState_1.UnitTestState.Successful:
                channel = Channel_1.Channel.Notice;
                break;
            case UnitTestState_1.UnitTestState.Error:
                channel = Channel_1.Channel.Error;
                additionalMessage += red`${ NEWLINE }Error: ${ this.test.exception }`;
                if (this.test.exception.stack) {
                    additionalMessage += yellow`${ NEWLINE }${ this.test.exception.stack }`;
                }
                break;
            case UnitTestState_1.UnitTestState.Timeout:
                channel = Channel_1.Channel.Warn;
                additionalMessage += red`${ NEWLINE }Timeout after ${ this.test.timesOutAfter / 1000 }s`;
                break;
        }
        if (this.test instanceof TestRunner_1.TestRunner) {
            additionalMessage = this.getTestRunnerStatistics();
        } else {
            this.test.assertionResults.forEach(result => {
                const state = result.successful ? UnitTestState_1.UnitTestState.Successful : UnitTestState_1.UnitTestState.Fail,
                      color = CliRenderer.getStateColor(state),
                      symbol = CliRenderer.getStateSymbol(state);
                assertionMessage += `${ NEWLINE }${ color }${ symbol }${ FG_DEFAULT } ${ result.description || '???' }`;
            });
        }
        this.write(channel, this.getFormattedStateSymbol(), this.getFormattedTestName(), assertionMessage, additionalMessage);
    }
}
exports.CliRenderer = CliRenderer;