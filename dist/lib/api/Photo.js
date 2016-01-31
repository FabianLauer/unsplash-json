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
var Category_1 = require('./Category');
class Photo extends BaseApiObject_1.BaseApiObject {
    /**
     * Loads a photo by id and returns a new `Photo` instance for that photo.
     */
    static loadById(apiClient, id) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const response = yield apiClient.sendRequest('/photos/' + id),
                  photo = new Photo(apiClient);
            Photo.applyPhotoInfoToInstance(photo, response);
            return photo;
        });
    }
    /**
     * Loads a list of photos from a URL that responds with an array of `IPhotoInfo` objects.
     * @see https://unsplash.com/documentation#list-photos
     * @param apiClient The client instance to use for the HTTP request.
     * @param url The URL that provides the array of `IPhotoInfo` objects.
     * @param additionalParams An optional key->value map of request parameters to send with the request.
     */
    static loadFromPhotoInfoListUrl(apiClient, url, additionalParams) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Photo.createFromPhotoInfoList(apiClient, (yield apiClient.sendRequest(url, undefined, additionalParams)));
        });
    }
    /**
     * Creates a photo for every record in a list of `IPhotoInfo` objects and returns the created photos as an array.
     * @see https://unsplash.com/documentation#list-photos
     */
    static createFromPhotoInfoList(apiClient, photoInfoList) {
        const photoArray = [];
        photoInfoList.forEach(photoInfo => {
            const photo = new Photo(apiClient);
            Photo.applyPhotoInfoToInstance(photo, photoInfo);
            photoArray.push(photo);
        });
        return photoArray;
    }
    /**
     * Get a single page from a photo search. Optionally limit your search to a set of categories.
     * *Note*: If supplying multiple category ID’s, the resulting photos will be those that match all of the given categories, not ones that match any category.
     * @see https://unsplash.com/documentation#search-photos
     * @param apiClient The client instance to use for the HTTP request.
     * @param query The search terms.
     * @param page The page number to retrieve. Optional, default is `1`.
     * @param perPage The number of photos per page. Optional, default is `10`.
     */
    static search(apiClient, query, categories, page, photosPerPage) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            var categoryParamValue;
            page = typeof page === 'number' ? page : 1;
            photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
            if (categories instanceof Array) {
                // make sure all items in the categories array are numbers (category IDs)
                categories.forEach((category, index) => {
                    if (category instanceof Category_1.Category) {
                        categories[index] = category.getId();
                    }
                });
                // filter out duplicate category IDs
                categories = categories.filter(category => {
                    return categories.indexOf(category) === -1;
                });
                // only send the category list if there's at least one category in it
                if (categories.length > 0) {
                    // the API expects a comma separated list:
                    categoryParamValue = categories.join(',');
                }
            }
            return Photo.createFromPhotoInfoList(apiClient, (yield apiClient.sendRequest('/photos/search/', undefined, {
                query: query,
                categories: categoryParamValue,
                page: page,
                per_page: photosPerPage
            })));
        });
    }
    getId() {
        return this.id;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getColor() {
        return this.color;
    }
    getThumbUrl() {
        return this.thumbUrl;
    }
    getSmallUrl() {
        return this.smallUrl;
    }
    getRegularUrl() {
        return this.regularUrl;
    }
    getFullUrl() {
        return this.fullUrl;
    }
    getSelfLink() {
        return this.selfLink;
    }
    getHtmlLink() {
        return this.htmlLink;
    }
    getDownloadLink() {
        return this.downloadLink;
    }
    /**
     * Applies a photo info object's data to a photo instance.
     */
    static applyPhotoInfoToInstance(photo, photoInfo) {
        photo.id = photoInfo.id;
        photo.width = photoInfo.width;
        photo.height = photoInfo.height;
        photo.color = photoInfo.color;
        photo.userRef = photoInfo.user;
        photo.fullUrl = photoInfo.urls.full;
        photo.regularUrl = photoInfo.urls.regular;
        photo.smallUrl = photoInfo.urls.small;
        photo.thumbUrl = photoInfo.urls.thumb;
        photo.selfLink = photoInfo.links.self;
        photo.htmlLink = photoInfo.links.html;
        photo.downloadLink = photoInfo.links.download;
    }
}
exports.Photo = Photo;