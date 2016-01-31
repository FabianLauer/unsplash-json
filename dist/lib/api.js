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
var Client_1 = require('./api/Client');
exports.Client = Client_1.Client;
var BaseApiObject_1 = require('./api/BaseApiObject');
exports.BaseApiObject = BaseApiObject_1.BaseApiObject;
var User_1 = require('./api/User');
exports.User = User_1.User;
var Photo_1 = require('./api/Photo');
exports.Photo = Photo_1.Photo;
var Category_1 = require('./api/Category');
exports.Category = Category_1.Category;
var CuratedBatch_1 = require('./api/CuratedBatch');
exports.CuratedBatch = CuratedBatch_1.CuratedBatch;
var Stats_1 = require('./api/Stats');
exports.Stats = Stats_1.Stats;