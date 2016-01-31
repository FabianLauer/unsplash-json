/**
 * Unsplash JSON API wrapper.
 * COPYRIGHT (c) 2016, Fabian Lauer
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 */
declare module "unsplash" {
    export module api {
        export abstract class BaseApiObject {
            private apiClient;
            /**
             * @param apiClient The api client instance this object belongs to.
             */
            constructor(apiClient: Client);
            getApiClient(): Client;
        }

        export class Category extends BaseApiObject {
            /**
             * Loads a category by id and returns it as a new `Category` instance.
             * @param apiClient The API client to use for HTTP requests.
             * @param id The category id to load.
             */
            static loadById(apiClient: Client, id: number): Promise<Category>;
            /**
             * Loads a list of categories from a URL that responds with an array of `ICategoryInfo` objects.
             * @see https://unsplash.com/documentation#list-categories
             * @param apiClient The client instance to use for the HTTP request.
             * @param url The URL that provides the array of `ICategoryInfo` objects.
             */
            static loadFromCategoryInfoListUrl(apiClient: Client, url: string): Promise<Category[]>;
            /**
             * Loads a list of all categories and returns them as an array.
             * @see https://unsplash.com/documentation#list-categories
             * @param apiClient The client instance to use for the HTTP request.
             */
            static loadAll(apiClient: Client): Promise<Category[]>;
            /**
             * Creates a category for every record in a list of `ICategoryInfo` objects and returns the created categories as an array.
             * @see https://unsplash.com/documentation#list-categories
             */
            static createFromCategoryInfoList(apiClient: Client, categoryInfoList: ICategoryInfo[]): Category[];
            getId(): number;
            getTitle(): string;
            getPhotoCount(): number;
            getSelfLink(): string;
            getPhotosLink(): string;
            /**
             * Loads photos from one of the category's pages and returns them as an array.
             * @param page The page number to retrieve. Optional, default is `1`.
             * @param perPage The number of photos per page. Optional, default is `10`.
             */
            loadPhotoPage(page?: number, photosPerPage?: number): Promise<Photo[]>;
            /**
             * Applies an `ICategoryInfo` object's data to an instance of `Category`.
             */
            private static applyCategoryInfoToInstance(category, categoryInfo);
            private id;
            private title;
            private photoCount;
            private selfLink;
            private photosLink;
        }

        /**
         * Unsplash API client.
         */
        export class Client {
            private credentials;
            private accessToken;
            /**
             * Creates an API client object.
             */
            constructor(credentials: ICredentials, accessToken?: IAccessToken);
            /**
             * The maximum number of requests that can be made by the client to the unsplash API every hour.
             */
            getHourlyRateLimit(): number;
            /**
             * The maximum number of requests that can be made by the client to the unsplash API in the current hour.
             */
            getRemainingHourlyRateLimit(): number;
            /**
             * Sends an HTTP request to the unsplash API and returns the response as an object.
             * @param urlPath The path (relative to the unsplash API's hostname) to send the request to.
             * @param method The HTTP method to send the request with. Optional, defaults to GET.
             * @param params A key->value map that holds the parameters to send along with the request. Optional.
             * @param additionalHeaders A key->value map that holds request headers to send. These headers might be overridden by the client instance's default headers.
             */
            sendRequest<TResponse>(urlPath: string, method?: net.HttpMethod, params?: any, additionalHeaders?: any): Promise<TResponse>;
            /**
             * This sets up all default headers required to authorize the client instance. Called only by the constructor *once* per instance.
             */
            private setupDefaultAuthorizationHeaders();
            /**
             * Merges a header object with the default headers of this client instance. The default headers override header fields of the `additionalHeaders` parameter if they have the same name.
             * @param additionalHeaders The header object to merge with the default headers. Optional. If omitted, an object containing the same values as the client's default headers will be returned.
             * @return Always returns an object, regardless of the parameter(s).
             */
            private mergeHeadersWithDefaultHeaders(additionalHeaders);
            /**
             * Called by `sendRequest(...)` after every completed HTTP request to gather info on the request/response pair.
             */
            private processCompletedHttpRequest();
            /**
             * The HTTP client. The created client supports whatever is available in the current environment (either `XMLHttpRequest` or node HTTP requests).
             */
            private httpClient;
            /**
             * The default headers sent with every request.
             */
            private defaultHeaders;
            /**
             * The maximum rate limit of this client.
             */
            private hourlyRatelimit;
            /**
             * The remaining rate limit of this client in the current hour.
             */
            private remainingHourlyRateLimit;
        }

        export class CuratedBatch extends BaseApiObject {
            /**
             * Loads a curated batch by id and returns it as a new `CuratedBatch` instance.
             * @param apiClient The API client to use for HTTP requests.
             * @param id The curated batch id to load.
             */
            static loadById(apiClient: Client, id: number): Promise<CuratedBatch>;
            /**
             * Loads a list of curated batches from a URL that responds with an array of `ICuratedBatchInfo` objects.
             * @see https://unsplash.com/documentation#list-curated batches
             * @param apiClient The client instance to use for the HTTP request.
             * @param url The URL that provides the array of `ICuratedBatchInfo` objects.
             * @param page The page number to retrieve. Optional, default is `1`.
             * @param perPage The number of photos per page. Optional, default is `10`.
             */
            static loadFromCuratedBatchInfoListUrl(apiClient: Client, url: string, page?: number, photosPerPage?: number): Promise<CuratedBatch[]>;
            /**
             * Loads a list of all curated batches and returns them as an array.
             * @see https://unsplash.com/documentation#list-curated batches
             * @param apiClient The client instance to use for the HTTP request.
             * @param page The page number to retrieve. Optional, default is `1`.
             * @param perPage The number of photos per page. Optional, default is `10`.
             */
            static loadCuratedBatchPage(apiClient: Client, page?: number, photosPerPage?: number): Promise<CuratedBatch[]>;
            /**
             * Creates a curated batch for every record in a list of `ICuratedBatchInfo` objects and returns the created curated batches as an array.
             * @see https://unsplash.com/documentation#list-curated batches
             */
            static createFromCuratedBatchInfoList(apiClient: Client, curatedBatchInfoList: ICuratedBatchInfo[]): CuratedBatch[];
            getId(): number;
            getPublishingDate(): Date;
            getNumDownloads(): number;
            getSelfLink(): string;
            getHtmlLink(): string;
            getPhotosLink(): string;
            getDownloadLink(): string;
            /**
             * Loads all photos of a curated batch and returns them as an array.
             */
            loadAllPhotos(): Promise<Photo[]>;
            /**
             * Applies an `ICuratedBatchInfo` object's data to an instance of `CuratedBatch`.
             */
            private static applyCuratedBatchInfoToInstance(curatedBatch, curatedBatchInfo);
            private id;
            private publishedAt;
            private numDownloads;
            private selfLink;
            private htmlLink;
            private photosLink;
            private downloadLink;
        }

        /**
         * OAuth access token information.
         */
        export interface IAccessToken {
            accessToken: string;
            /**
             * The refresh token is required when the access token expires.
             */
            refreshToken: string;
            /**
             * Defines when the access token will expire.
             */
            expiresIn: number;
        }

        /**
         * Describes request headers sent along with every request.
         */
        export interface IBaseRequestHeaders {
            /**
             * When this contains the application ID (see example below), the request can perform public actions. Refer to the original unsplash API docs for more.
             * @see https://unsplash.com/documentation#public-actions
             * @example
             *     Authorization: Client-ID YOUR_APPLICATION_ID
             */
            Authorization: string;
        }

        /**
         * Information about a single category.
         * @see https://unsplash.com/documentation#categories
         */
        export interface ICategoryInfo {
            id: number;
            title: string;
            photo_count: number;
            links: {
                self: string;
                photos: string;
            };
        }

        /**
         * API credentials.
         */
        export interface ICredentials {
            /**
             * The application id. This is required for every request.
             */
            applicationId: string;
            /**
             * A secret key required for OAuth authentification.
             */
            secret?: string;
            /**
             * The callback URL for OAuth authentification.
             */
            callbackUrl: string;
        }

        /**
         * Information about a single curated batch.
         * @see https://unsplash.com/documentation#curated-batches
         */
        export interface ICuratedBatchInfo {
            id: number;
            published_at: string;
            downloads: number;
            curator: {
                id: string;
                username: string;
                name: string;
                bio: string;
                links: {
                    self: string;
                    html: string;
                    photos: string;
                    likes: string;
                };
            };
            links: {
                self: string;
                html: string;
                photos: string;
                download: string;
            };
        }

        /**
         * Describes the response to a get stats request.
         * @see https://unsplash.com/documentation#stats
         */
        export interface IGetStatsInfoResponse {
            photo_downloads: number;
            batch_downloads: number;
        }

        /**
         * Describes the response returned from requests against https://api.unsplash.com/users/<<username>>.
         */
        export interface IGetUserInfoResponse {
            username: string;
            first_name: string;
            last_name: string;
            portfolio_url: string;
            downloads: number;
            profile_image: {
                small: string;
                medium: string;
                large: string;
            };
            links: IUserLinkList;
        }

        /**
         * Information about a single photo. This format is used in multiple places of the unsplash API.
         * @see https://unsplash.com/documentation#photos
         */
        export interface IPhotoInfo {
            id: string;
            width: number;
            height: number;
            color: string;
            user: {
                id: string;
                username: string;
                name: string;
                links: IUserLinkList;
            };
            urls: {
                full: string;
                regular: string;
                small: string;
                thumb: string;
            };
            links: {
                self: string;
                html: string;
                download: string;
            };
        }

        export interface IUserLinkList {
            self: string;
            html: string;
            photos: string;
            likes: string;
        }

        export class Photo extends BaseApiObject {
            /**
             * Loads a photo by id and returns a new `Photo` instance for that photo.
             */
            static loadById(apiClient: Client, id: string): Promise<Photo>;
            /**
             * Loads a list of photos from a URL that responds with an array of `IPhotoInfo` objects.
             * @see https://unsplash.com/documentation#list-photos
             * @param apiClient The client instance to use for the HTTP request.
             * @param url The URL that provides the array of `IPhotoInfo` objects.
             * @param additionalParams An optional key->value map of request parameters to send with the request.
             */
            static loadFromPhotoInfoListUrl(apiClient: Client, url: string, additionalParams?: any): Promise<Photo[]>;
            /**
             * Creates a photo for every record in a list of `IPhotoInfo` objects and returns the created photos as an array.
             * @see https://unsplash.com/documentation#list-photos
             */
            static createFromPhotoInfoList(apiClient: Client, photoInfoList: IPhotoInfo[]): Photo[];
            /**
             * Get a single page from a photo search. Optionally limit your search to a set of categories.
             * *Note*: If supplying multiple category ID’s, the resulting photos will be those that match all of the given categories, not ones that match any category.
             * @see https://unsplash.com/documentation#search-photos
             * @param apiClient The client instance to use for the HTTP request.
             * @param query The search terms.
             * @param page The page number to retrieve. Optional, default is `1`.
             * @param perPage The number of photos per page. Optional, default is `10`.
             */
            static search(apiClient: Client, query: string, categories?: Array<Category | number>, page?: number, photosPerPage?: number): Promise<Photo[]>;
            getId(): string;
            getWidth(): number;
            getHeight(): number;
            getColor(): string;
            getThumbUrl(): string;
            getSmallUrl(): string;
            getRegularUrl(): string;
            getFullUrl(): string;
            getSelfLink(): string;
            getHtmlLink(): string;
            getDownloadLink(): string;
            /**
             * Applies a photo info object's data to a photo instance.
             */
            private static applyPhotoInfoToInstance(photo, photoInfo);
            private id;
            private userRef;
            private width;
            private height;
            private color;
            private thumbUrl;
            private smallUrl;
            private regularUrl;
            private fullUrl;
            private selfLink;
            private htmlLink;
            private downloadLink;
        }

        export class Stats extends BaseApiObject {
            /**
             * Loads statistics information.
             * @param apiClient The api client object to use for requests.
             */
            static load(apiClient: Client): Promise<Stats>;
            getPhotoDownloads(): number;
            getBatchDownloads(): number;
            /**
             * Applies a stats info object's data to a `Stats` instance.
             */
            private static applyStatsInfoResponseToInstance(stats, statsInfo);
            private photoDownloads;
            private batchDownloads;
        }

        export class User extends BaseApiObject {
            /**
             * Loads a user by username and returns a new `User` instance for that user.
             */
            static loadByUsername(apiClient: Client, username: string): Promise<User>;
            getUsername(): string;
            getFirstName(): string;
            getLastName(): string;
            getPortfolioUrl(): string;
            getNumDownloads(): number;
            getSmallProfileImageUrl(): string;
            getMediumProfileImageUrl(): string;
            getLargeProfileImageUrl(): string;
            getSelfLink(): string;
            getHtmlLink(): string;
            getPhotosLink(): string;
            getLikesLink(): string;
            /**
             * Loads all photos of this user and returns them as an array.
             */
            loadPhotos(): Promise<Photo[]>;
            /**
             * Applies a user info response object to a user instance.
             */
            private static applyUserInfoResponseToInstance(user, userInfoResponse);
            private username;
            private firstName;
            private lastName;
            private portfolioUrl;
            private numDownloads;
            private smallProfileImageUrl;
            private meduimProfileImageUrl;
            private largeProfileImageUrl;
            private selfLink;
            private htmlLink;
            private photosLink;
            private likesLink;
        }

    } // module api
    export module net {
        /**
         * HTTP client objects can send requests to a host and return the response. For simplicity, they only support one host name at a time, which has to be set when the client object is created. This avoids having to add the host name to every call against the `sendRequest` method.
         */
        export abstract class AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
            private hostname;
            private useHttps;
            /**
             * Creates a HTTP client object.
             * @param hostname The name of the host to send requests to, such as a domain name or IP.
             * @param useHttps Whether to send requests to the host via HTTPS or plain HTTP. When `true`, the client will use HTTPS.
             */
            constructor(hostname: string, useHttps: boolean);
            /**
             * Returns `true` if the http client uses HTTPS, `false` if it uses HTTP.
             */
            getUseHttps(): boolean;
            /**
             * Returns the hostname this http client sends requests to.
             */
            getHostName(): string;
            /**
             * Checks whether a value is a valid `HttpMethod` enum value.
             * @param method The value to check.
             */
            static isValidHttpMethod(method: HttpMethod): boolean;
            /**
             * Sends a request and returns the response as an object.
             * @param urlPath The path (relative to the client's hostname) to send the request to.
             * @param method The HTTP method to send the request with.
             * @param params A key->value map that holds the parameters to send along with the request.
             * @param headers A key->value map that holds request headers to be sent.
             */
            sendRequest<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse>;
            /**
             * Returns a response header value from the last request that was made. Returns `undefined` if no header field with this name exists or if no requests were made yet.
             * @param headerName The name of the header to get. This is **case insensitive**.
             */
            getResponseHeaderFromLastRequest(headerName: string): string;
            /**
             * Sends a request and returns the response as an object.
             * @param urlPath The path (relative to the client's hostname) to send the request to.
             * @param method The HTTP method to send the request with.
             * @param params A key->value map that holds the parameters to send along with the request.
             * @param headers A key->value map that holds request headers to be sent.
             */
            protected abstract sendRequestConcrete<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse>;
            /**
             * Returns the http client's protocol as a string.
             */
            protected getProtocolString(): string;
            /**
             * Generates a full URL containing the hostname and a normalized url path.
             * @param urlPath The url path to append to the client's hostname. The url path will be normalized.
             */
            protected generateFullUrl(urlPath: string): string;
            /**
             * Stores a response header.
             * @param headerName The name of the header.
             * @param headerValue The header's value.
             */
            protected setResponseHeaderFromLastRequest(headerName: string, headerValue: string): void;
            /**
             * Converts a `HttpMethod` enum value to a string.
             * @param method The `HttpMethod` enum value to convert to a string.
             */
            protected static httpMethodToString(method: HttpMethod): string;
            /**
             * Checks whether `XMLHttpRequest` is supported.
             */
            protected static supportsXmlHttp(): boolean;
            /**
             * Normalizes a host name.
             */
            private static normalizeHostname(baseUrl);
            /**
             * Normalizes a URL path.
             */
            private static normalizeUrlPath(urlPath);
            /**
             * Ensures that a url string only contains the url path, but not the base url of this http client.
             * @example
             *     const client = new AbstractHttpClient('example.com', true);
             *     console.log(client.ensureIsJustUrlPath('/foo/bar')); // nothing to remove, logs 'foo/bar'
             *     console.log(client.ensureIsJustUrlPath('example.com/foo/bar')); // base url is removed, also logs 'foo/bar'
             */
            private ensureIsJustUrlPath(url);
            /**
             * Converts a key->value object to a query string.
             */
            private paramObjectToQueryString(params);
            /**
             * Resets the `lastResponseHeaders` property. Called before every request send with `sendRequest`.
             */
            private clearLastResponseHeaders();
            /**
             * Holds the response headers of the last request made as a key->value map. **Keys written to this object MUST be lowercase**.
             */
            private lastResponseHeaders;
        }

        export abstract class HttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
            /**
             * Creates a HTTP client that works in the current environment.
             */
            static createForCurrentEnvironment<TBaseRequestHeaders, TBaseRequest, TBaseResponse>(baseUrl: string, useHttps: boolean): HttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse>;
        }

        /**
         * Enumerates HTTP methods.
         */
        export enum HttpMethod {
            Get = 1,
            Post = 2,
            Put = 3,
            Delete = 4,
        }

        export class NodeHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
            /**
             * Sends a request and returns the response as an object.
             * @param urlPath The path (relative to the client's hostname) to send the request to.
             * @param method The HTTP method to send the request with.
             * @param params A key->value map that holds the parameters to send along with the request.
             * @param headers A key->value map that holds request headers to be sent.
             */
            protected sendRequestConcrete<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse>;
            /**
             * Returns the request module (either node's `http` or `https` module) to use, depending on whether this http client uses HTTPS or plain HTTP.
             */
            private getRequestModule();
            /**
             * Sends a node.js request and returns a promise that is resolved with the complete response text as soon as the request has completed.
             */
            private sendNodeRequest(urlPath, method, params, headers);
            /**
             * Creates a request options object for a certain request configuration.
             */
            private createRequestOptions(urlPath, method, params, headers);
            /**
             * Stores response headers so that users of this class can access them.
             */
            private storeAllResponseHeaders(response);
        }

        export class XmlHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
            /**
             * Sends a request and returns the response as an object.
             * @param urlPath The path (relative to the client's hostname) to send the request to.
             * @param method The HTTP method to send the request with.
             * @param params A key->value map that holds the parameters to send along with the request.
             * @param headers A key->value map that holds request headers to be sent.
             */
            protected sendRequestConcrete<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse>;
            private waitForRequestComplete(request);
            private storeAllResponseHeaders(request);
        }

    } // module net
    export module util {
        export class Event<THandler extends Function> {
            bind(handler: THandler): THandler;
            once(handler: THandler): void;
            unbind(handler: THandler): void;
            trigger(...args: any[]): void;
            private handlers;
        }

    } // module util
} // module unsplash
