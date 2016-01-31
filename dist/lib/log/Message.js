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
var Channel_1 = require('./Channel');
/**
 * Log messages. These messages are aggregated by instances of class `Writer`.
 */
class Message {
    constructor() {
        this.timestamp = new Date();
    }
    static createWithText(text) {
        var message = new this();
        message.text = text;
        return message;
    }
    getTime() {
        if (this.timestamp instanceof Date) {
            return new Date(this.timestamp.getTime());
        }
        return undefined;
    }
    getChannel() {
        return this.channel;
    }
    setChannel(channel) {
        this.channel = channel;
        return this;
    }
    getText() {
        return this.text;
    }
    toString() {
        return `${ Message.formatDateTime(this.timestamp) } (${ Message.logChannelToString(this.channel) }): ${ this.text }`;
    }
    static formatDateTime(date) {
        const seconds = `${ date.getSeconds() < 10 ? '0' : '' }${ date.getSeconds() }`;
        return `${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() } ${ date.getHours() }:${ date.getMinutes() }:${ seconds }`;
    }
    static logChannelToString(channel) {
        return Channel_1.Channel[channel];
    }
}
exports.Message = Message;