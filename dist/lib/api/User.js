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
class User extends BaseApiObject_1.BaseApiObject {
    /**
     * Loads a user by username and returns a new `User` instance for that user.
     */
    static loadByUsername(apiClient, username) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const response = yield apiClient.sendRequest('/users/' + username),
                  user = new User(apiClient);
            User.applyUserInfoResponseToInstance(user, response);
            return user;
        });
    }
    getUsername() {
        return this.username;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getPortfolioUrl() {
        return this.portfolioUrl;
    }
    getNumDownloads() {
        return this.numDownloads;
    }
    getSmallProfileImageUrl() {
        return this.smallProfileImageUrl;
    }
    getMediumProfileImageUrl() {
        return this.meduimProfileImageUrl;
    }
    getLargeProfileImageUrl() {
        return this.largeProfileImageUrl;
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
    getLikesLink() {
        return this.likesLink;
    }
    /**
     * Loads all photos of this user and returns them as an array.
     */
    loadPhotos() {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Photo_1.Photo.loadFromPhotoInfoListUrl(this.getApiClient(), this.getPhotosLink());
        });
    }
    /**
     * Applies a user info response object to a user instance.
     */
    static applyUserInfoResponseToInstance(user, userInfoResponse) {
        user.username = userInfoResponse.username;
        user.firstName = userInfoResponse.first_name;
        user.lastName = userInfoResponse.last_name;
        user.portfolioUrl = userInfoResponse.portfolio_url;
        user.numDownloads = userInfoResponse.downloads;
        user.smallProfileImageUrl = userInfoResponse.profile_image.small;
        user.meduimProfileImageUrl = userInfoResponse.profile_image.medium;
        user.largeProfileImageUrl = userInfoResponse.profile_image.large;
        user.selfLink = userInfoResponse.links.self;
        user.htmlLink = userInfoResponse.links.html;
        user.photosLink = userInfoResponse.links.photos;
        user.likesLink = userInfoResponse.links.likes;
    }
}
exports.User = User;