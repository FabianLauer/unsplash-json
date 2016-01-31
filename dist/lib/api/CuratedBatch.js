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
var Photo_1 = require('./Photo');
class CuratedBatch extends BaseApiObject_1.BaseApiObject {
    /**
     * Loads a curated batch by id and returns it as a new `CuratedBatch` instance.
     * @param apiClient The API client to use for HTTP requests.
     * @param id The curated batch id to load.
     */
    static loadById(apiClient, id) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const response = yield apiClient.sendRequest('/curated_batches/' + id),
                  curatedBatch = new CuratedBatch(apiClient);
            CuratedBatch.applyCuratedBatchInfoToInstance(curatedBatch, response);
            return curatedBatch;
        });
    }
    /**
     * Loads a list of curated batches from a URL that responds with an array of `ICuratedBatchInfo` objects.
     * @see https://unsplash.com/documentation#list-curated batches
     * @param apiClient The client instance to use for the HTTP request.
     * @param url The URL that provides the array of `ICuratedBatchInfo` objects.
     * @param page The page number to retrieve. Optional, default is `1`.
     * @param perPage The number of photos per page. Optional, default is `10`.
     */
    static loadFromCuratedBatchInfoListUrl(apiClient, url, page, photosPerPage) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            page = typeof page === 'number' ? page : 1;
            photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
            return CuratedBatch.createFromCuratedBatchInfoList(apiClient, (yield apiClient.sendRequest(url, undefined, {
                page: page,
                per_page: photosPerPage
            })));
        });
    }
    /**
     * Loads a list of all curated batches and returns them as an array.
     * @see https://unsplash.com/documentation#list-curated batches
     * @param apiClient The client instance to use for the HTTP request.
     * @param page The page number to retrieve. Optional, default is `1`.
     * @param perPage The number of photos per page. Optional, default is `10`.
     */
    static loadCuratedBatchPage(apiClient, page, photosPerPage) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            page = typeof page === 'number' ? page : 1;
            photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
            return CuratedBatch.loadFromCuratedBatchInfoListUrl(apiClient, '/curated_batches', page, photosPerPage);
        });
    }
    /**
     * Creates a curated batch for every record in a list of `ICuratedBatchInfo` objects and returns the created curated batches as an array.
     * @see https://unsplash.com/documentation#list-curated batches
     */
    static createFromCuratedBatchInfoList(apiClient, curatedBatchInfoList) {
        const curatedBatchArray = [];
        curatedBatchInfoList.forEach(curatedBatchInfo => {
            const curatedBatch = new CuratedBatch(apiClient);
            CuratedBatch.applyCuratedBatchInfoToInstance(curatedBatch, curatedBatchInfo);
            curatedBatchArray.push(curatedBatch);
        });
        return curatedBatchArray;
    }
    getId() {
        return this.id;
    }
    getPublishingDate() {
        // return a copy of the original date to avoid user code overwriting object data
        return new Date(this.publishedAt.getTime());
    }
    getNumDownloads() {
        return this.numDownloads;
    }
    getSelfLink() {
        return this.selfLink;
    }
    getHtmlLink() {
        return this.htmlLink;
    }
    getPhotosLink() {
        return this.photosLink;
    }
    getDownloadLink() {
        return this.downloadLink;
    }
    /**
     * Loads all photos of a curated batch and returns them as an array.
     */
    loadAllPhotos() {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Photo_1.Photo.loadFromPhotoInfoListUrl(this.getApiClient(), this.getPhotosLink());
        });
    }
    /**
     * Applies an `ICuratedBatchInfo` object's data to an instance of `CuratedBatch`.
     */
    static applyCuratedBatchInfoToInstance(curatedBatch, curatedBatchInfo) {
        curatedBatch.id = curatedBatchInfo.id;
        curatedBatch.publishedAt = new Date(curatedBatchInfo.published_at);
        curatedBatch.numDownloads = curatedBatchInfo.downloads;
        curatedBatch.selfLink = curatedBatchInfo.links.self;
        curatedBatch.htmlLink = curatedBatchInfo.links.html;
        curatedBatch.photosLink = curatedBatchInfo.links.photos;
        curatedBatch.downloadLink = curatedBatchInfo.links.download;
    }
}
exports.CuratedBatch = CuratedBatch;