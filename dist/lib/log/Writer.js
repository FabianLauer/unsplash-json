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
var Message_1 = require('./Message');
/**
 * Log writers.
 */
class Writer {
    constructor() {
        this.messages = [];
    }
    getLogMessages() {
        return [].concat(this.messages);
    }
    pipeLogMessagesTo(target) {
        if (target instanceof Writer) {
            this.pipeLogMessagesToOtherLogWriter(target);
        } else {
            this.pipeLogMessagesToStream(target);
        }
    }
    toString() {
        return this.messages.join('\n');
    }
    /**
     * Appends a single log message to the log.
     */
    appendToLog(message) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            if (!(message instanceof Message_1.Message)) {
                return;
            }
            this.messages.push(message);
            if (this.pipeTargetWriters && this.pipeTargetWriters.length > 0) {
                this.pipeTargetWriters.forEach(targetLog => targetLog.appendToLog(message));
            }
            if (this.pipeTargetStreams && this.pipeTargetStreams.length > 0) {
                this.pipeTargetStreams.forEach(targetStream => targetStream.write(message.toString() + '\n'));
            }
        });
    }
    /**
     * Logs a message to a certain channel.
     * @param channel The channel to log the message to.
     * @param message The message to log.
     */
    logMessage(channel) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        return __awaiter(this, void 0, _promise2.default, function* () {
            yield this.appendToLog(this.createMessage(channel, message.join('')));
        });
    }
    createMessage(channel, messageText) {
        return Message_1.Message.createWithText(messageText).setChannel(channel);
    }
    pipeLogMessagesToStream(stream) {
        if (this.pipeTargetStreams && this.pipeTargetStreams.length > 0 && this.pipeTargetStreams.indexOf(stream) === -1) {
            this.pipeTargetStreams.push(stream);
        } else {
            this.pipeTargetStreams = [stream];
        }
    }
    pipeLogMessagesToOtherLogWriter(log) {
        if (log === this) {
            throw new Error("Can not pipe log messages to self.");
        }
        if (this.pipeTargetWriters && this.pipeTargetWriters.length > 0 && this.pipeTargetWriters.indexOf(log) === -1) {
            this.pipeTargetWriters.push(log);
        } else {
            this.pipeTargetWriters = [log];
        }
    }
}
exports.Writer = Writer;