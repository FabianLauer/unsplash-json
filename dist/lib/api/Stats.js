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
var BaseApiObject_1 = require('./BaseApiObject');
class Stats extends BaseApiObject_1.BaseApiObject {
    /**
     * Loads statistics information.
     * @param apiClient The api client object to use for requests.
     */
    static load(apiClient) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const response = yield apiClient.sendRequest('/stats/total'),
                  stats = new Stats(apiClient);
            Stats.applyStatsInfoResponseToInstance(stats, response);
            return stats;
        });
    }
    getPhotoDownloads() {
        return this.photoDownloads;
    }
    getBatchDownloads() {
        return this.batchDownloads;
    }
    /**
     * Applies a stats info object's data to a `Stats` instance.
     */
    static applyStatsInfoResponseToInstance(stats, statsInfo) {
        stats.photoDownloads = statsInfo.photo_downloads;
        stats.batchDownloads = statsInfo.batch_downloads;
    }
}
exports.Stats = Stats;