import {ICredentials} from './ICredentials';
import {IAccessToken} from './IAccessToken';
import {IBaseRequestHeaders} from './IBaseRequestHeaders';
import * as net from '../net';

/**
 * Unsplash API client.
 */
export class Client {
	/**
	 * Creates an API client object.
	 */
	constructor(private credentials: ICredentials, private accessToken?: IAccessToken) {
		this.setupDefaultAuthorizationHeaders();
	}
	
	
	/**
	 * The maximum number of requests that can be made by the client to the unsplash API every hour.
	 */
	public getHourlyRateLimit(): number {
		return this.hourlyRatelimit;
	}
	
	
	/**
	 * The maximum number of requests that can be made by the client to the unsplash API in the current hour.
	 */
	public getRemainingHourlyRateLimit(): number {
		return this.remainingHourlyRateLimit;
	}
	
	
	/**
	 * Sends an HTTP request to the unsplash API and returns the response as an object.
	 * @param urlPath The path (relative to the unsplash API's hostname) to send the request to.
	 * @param method The HTTP method to send the request with. Optional, defaults to GET.
	 * @param params A key->value map that holds the parameters to send along with the request. Optional.
	 * @param additionalHeaders A key->value map that holds request headers to send. These headers might be overridden by the client instance's default headers.
	 */
	public async sendRequest<TResponse>(urlPath: string, method?: net.HttpMethod, params?: any, additionalHeaders?: any): Promise<TResponse> {
		if (!net.HttpClient.isValidHttpMethod(method)) {
			method = net.HttpMethod.Get;
		}
		const response = await this.httpClient.sendRequest<TResponse>(urlPath, method, params, this.mergeHeadersWithDefaultHeaders(additionalHeaders));
		this.processCompletedHttpRequest();
		return response;
	}
	
	
	/**
	 * This sets up all default headers required to authorize the client instance. Called only by the constructor *once* per instance.
	 */
	private setupDefaultAuthorizationHeaders(): void {
		// see https://unsplash.com/documentation#public-actions for the exact format of the 'Authorization' header:
		this.defaultHeaders.Authorization = 'Client-ID ' + this.credentials.applicationId;
	}
	
	
	/**
	 * Merges a header object with the default headers of this client instance. The default headers override header fields of the `additionalHeaders` parameter if they have the same name.
	 * @param additionalHeaders The header object to merge with the default headers. Optional. If omitted, an object containing the same values as the client's default headers will be returned.
	 * @return Always returns an object, regardless of the parameter(s).
	 */
	private mergeHeadersWithDefaultHeaders(additionalHeaders: any): IBaseRequestHeaders {
		if (typeof additionalHeaders !== 'object' || additionalHeaders === null) {
			additionalHeaders = {};
		}
		for (let name in this.defaultHeaders) {
			additionalHeaders[name] = (<any>this.defaultHeaders)[name];
		}
		return additionalHeaders;
	}
	
	
	/**
	 * Called by `sendRequest(...)` after every completed HTTP request to gather info on the request/response pair.
	 */
	private processCompletedHttpRequest(): void {
		// rate limit headers (https://unsplash.com/documentation#rate-limiting):
		this.hourlyRatelimit = parseInt(this.httpClient.getResponseHeaderFromLastRequest('X-Ratelimit-Limit'), 10);
		this.remainingHourlyRateLimit = parseInt(this.httpClient.getResponseHeaderFromLastRequest('X-Ratelimit-Remaining'), 10);
	}
	
	
	/**
	 * The HTTP client. The created client supports whatever is available in the current environment (either `XMLHttpRequest` or node HTTP requests).
	 */
	private httpClient = net.HttpClient.createForCurrentEnvironment<IBaseRequestHeaders, any, any>('api.unsplash.com', true);
	
	
	/**
	 * The default headers sent with every request.
	 */
	private defaultHeaders: IBaseRequestHeaders = {
		Authorization: undefined
	};
	
	
	/**
	 * The maximum rate limit of this client.
	 */
	private hourlyRatelimit: number;
	
	
	/**
	 * The remaining rate limit of this client in the current hour.
	 */
	private remainingHourlyRateLimit: number;
}