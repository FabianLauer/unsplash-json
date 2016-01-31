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
class Category extends BaseApiObject_1.BaseApiObject {
    /**
     * Loads a category by id and returns it as a new `Category` instance.
     * @param apiClient The API client to use for HTTP requests.
     * @param id The category id to load.
     */
    static loadById(apiClient, id) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const response = yield apiClient.sendRequest('/categories/' + id),
                  category = new Category(apiClient);
            Category.applyCategoryInfoToInstance(category, response);
            return category;
        });
    }
    /**
     * Loads a list of categories from a URL that responds with an array of `ICategoryInfo` objects.
     * @see https://unsplash.com/documentation#list-categories
     * @param apiClient The client instance to use for the HTTP request.
     * @param url The URL that provides the array of `ICategoryInfo` objects.
     */
    static loadFromCategoryInfoListUrl(apiClient, url) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Category.createFromCategoryInfoList(apiClient, (yield apiClient.sendRequest(url)));
        });
    }
    /**
     * Loads a list of all categories and returns them as an array.
     * @see https://unsplash.com/documentation#list-categories
     * @param apiClient The client instance to use for the HTTP request.
     */
    static loadAll(apiClient) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Category.loadFromCategoryInfoListUrl(apiClient, '/categories');
        });
    }
    /**
     * Creates a category for every record in a list of `ICategoryInfo` objects and returns the created categories as an array.
     * @see https://unsplash.com/documentation#list-categories
     */
    static createFromCategoryInfoList(apiClient, categoryInfoList) {
        const categoryArray = [];
        categoryInfoList.forEach(categoryInfo => {
            const category = new Category(apiClient);
            Category.applyCategoryInfoToInstance(category, categoryInfo);
            categoryArray.push(category);
        });
        return categoryArray;
    }
    getId() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    getPhotoCount() {
        return this.photoCount;
    }
    getSelfLink() {
        return this.selfLink;
    }
    getPhotosLink() {
        return this.photosLink;
    }
    /**
     * Loads photos from one of the category's pages and returns them as an array.
     * @param page The page number to retrieve. Optional, default is `1`.
     * @param perPage The number of photos per page. Optional, default is `10`.
     */
    loadPhotoPage(page, photosPerPage) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            page = typeof page === 'number' ? page : 1;
            photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
            return Photo_1.Photo.loadFromPhotoInfoListUrl(this.getApiClient(), this.getPhotosLink(), {
                page: page,
                per_page: photosPerPage
            });
        });
    }
    /**
     * Applies an `ICategoryInfo` object's data to an instance of `Category`.
     */
    static applyCategoryInfoToInstance(category, categoryInfo) {
        category.id = categoryInfo.id;
        category.title = categoryInfo.title;
        category.photoCount = categoryInfo.photo_count;
        category.selfLink = categoryInfo.links.self;
        category.photosLink = categoryInfo.links.photos;
    }
}
exports.Category = Category;