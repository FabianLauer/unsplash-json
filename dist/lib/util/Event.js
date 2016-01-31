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
class Event {
    bind(handler) {
        if (this.handlers) this.handlers.push(handler);else this.handlers = [handler];
        return handler;
    }
    once(handler) {
        this.bind(() => {
            this.unbind(handler);
            handler.apply(null, arguments);
        });
    }
    unbind(handler) {
        if (this.handlers && this.handlers.length > 0) {
            let index = this.handlers.indexOf(handler);
            while (index !== -1) {
                this.handlers.splice(index, 1);
                index = this.handlers.indexOf(handler);
            }
        }
        if (this.handlers.length === 0) this.handlers = undefined;
    }
    trigger() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (this.handlers && this.handlers.length > 0) {
            this.handlers.forEach(handler => handler.apply(null, args));
        }
    }
}
exports.Event = Event;