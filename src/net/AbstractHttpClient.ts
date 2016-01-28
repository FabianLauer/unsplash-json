/// <reference path="../../typings/node" />
import * as url from 'url';
import {HttpMethod} from './HttpMethod';

/**
 * HTTP client objects can send requests to a host and return the response. For simplicity, they only support one host name at a time, which has to be set when the client object is created. This avoids having to add the host name to every call against the `sendRequest` method.
 */
export abstract class AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
	/**
	 * Creates a HTTP client object.
	 * @param hostname The name of the host to send requests to, such as a domain name or IP.
	 * @param useHttps Whether to send requests to the host via HTTPS or plain HTTP. When `true`, the client will use HTTPS.
	 */
	constructor(private hostname: string, private useHttps: boolean) {
		this.hostname = AbstractHttpClient.normalizeHostname(hostname);
		this.useHttps = !!useHttps;
	}
	
	
	/**
	 * Returns `true` if the http client uses HTTPS, `false` if it uses HTTP.
	 */
	public getUseHttps(): boolean {
		return this.useHttps;
	}

	
	/**
	 * Returns the hostname this http client sends requests to.
	 */
	public getHostName(): string {
		return this.hostname;
	}
	
	
	/**
	 * Checks whether a value is a valid `HttpMethod` enum value.
	 * @param method The value to check.
	 */
	public static isValidHttpMethod(method: HttpMethod): boolean {
		switch (method) {
			case HttpMethod.Get:
			case HttpMethod.Post:
			case HttpMethod.Put:
			case HttpMethod.Delete:
				return true;
				
			default:
				return false;
		}
	}
	
	
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's hostname) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 * @param headers A key->value map that holds request headers to be sent.
	 */
	public async sendRequest<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse> {
		/// TODO: Reject requests to this method if this client is still requesting information.
		this.clearLastResponseHeaders();
		return this.sendRequestConcrete<TResponse>(this.ensureIsJustUrlPath(urlPath), method, params, headers);
	}
	
	
	/**
	 * Returns a response header value from the last request that was made. Returns `undefined` if the no header field with this name exists or if no requests were made yet. 
	 * @param headerName The name of the header to get. This is **case insensitive**.
	 */
	public getResponseHeaderFromLastRequest(headerName: string): string {
		return (<any>this.lastResponseHeaders)[headerName.toLowerCase()];
	}
	
	
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's hostname) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 * @param headers A key->value map that holds request headers to be sent.
	 */
	protected abstract async sendRequestConcrete<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse>;
	
	
	/**
	 * Returns the http client's protocol as a string.
	 */
	protected getProtocolString(): string {
		return this.useHttps ? 'https' : 'http';
	}
	
	
	/**
	 * Generates a full URL containing the hostname and a normalized url path.
	 * @param urlPath The url path to append to the client's hostname. The url path will be normalized.
	 */
	protected generateFullUrl(urlPath: string): string {
		return this.hostname + AbstractHttpClient.normalizeUrlPath(urlPath);
	}
	
	
	/**
	 * Stores a response header.
	 * @param headerName The name of the header.
	 * @param headerValue The header's value.
	 */
	protected setResponseHeaderFromLastRequest(headerName: string, headerValue: string): void {
		(<any>this.lastResponseHeaders)[headerName.toLowerCase()] = headerValue;
	}
	
	
	/**
	 * Converts a `HttpMethod` enum value to a string.
	 * @param method The `HttpMethod` enum value to convert to a string.
	 */
	protected static httpMethodToString(method: HttpMethod): string {
		switch (method) {
			case HttpMethod.Get:
				return 'get';
			case HttpMethod.Post:
				return 'post';
			case HttpMethod.Put:
				return 'put';
			case HttpMethod.Delete:
				return 'delete';
		}
	}
	
	
	/**
	 * Checks whether `XMLHttpRequest` is supported.
	 */
	protected static supportsXmlHttp(): boolean {
		return typeof XMLHttpRequest === 'function';
	}
	
	
	/**
	 * Normalizes a host name.
	 */
	private static normalizeHostname(baseUrl: string): string {
		return baseUrl.replace(/\/+$/, '');
	}
	
	
	/**
	 * Normalizes a URL path.
	 */
	private static normalizeUrlPath(urlPath: string): string {
		return ('/' + (urlPath || '')).replace(/\/+/g, '/');
	}
	
	
	/**
	 * Ensures that a url string only contains the url path, but not the base url of this http client.
	 * @example
	 *     const client = new AbstractHttpClient('example.com', true);
	 *     console.log(client.ensureIsJustUrlPath('/foo/bar')); // nothing to remove, logs 'foo/bar'
	 *     console.log(client.ensureIsJustUrlPath('example.com/foo/bar')); // base url is removed, also logs 'foo/bar'
	 */
	private ensureIsJustUrlPath(url: string): string {
		return AbstractHttpClient.normalizeUrlPath(url.replace(new RegExp('^(http(s)?\:\/\/)?' + this.hostname), ''));
	}
	
	
	/**
	 * Converts a key->value object to a query string.
	 */
	private paramObjectToQueryString(params: any): string {
		var queryString = '';
		for (let key in params) {
			queryString += `${key}=${params[key]}`;
		}
		return queryString;
	}
	
	
	/**
	 * Resets the `lastResponseHeaders` property. Called before every request send with `sendRequest`.
	 */
	private clearLastResponseHeaders(): void {
		for (let name in this.lastResponseHeaders) {
			delete (<any>this.lastResponseHeaders)[name];
		}
	}
	
	
	/**
	 * Holds the response headers of the last request made as a key->value map. **Keys written to this object MUST be lowercase**.
	 */
	private lastResponseHeaders = {};
}