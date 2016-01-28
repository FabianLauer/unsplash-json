/// <reference path="../../typings/node" />
import * as url from 'url';
import {HttpMethod} from './HttpMethod';

export abstract class AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
	constructor(private hostname: string, private useHttps: boolean) {
		this.hostname = AbstractHttpClient.normalizeBaseUrl(hostname);
		this.useHttps = !!useHttps;
	}
	
	
	public getUseHttps(): boolean {
		return this.useHttps;
	}

	
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
		return this.sendRequestConcrete<TResponse>(this.ensureIsJustUrlPath(urlPath), method, params, headers);
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
	 * 
	 */
	protected getProtocolString(): string {
		return this.useHttps ? 'https' : 'http';
	}
	
	
	/**
	 * 
	 */
	protected generateFullUrl(urlPath: string): string {
		return this.hostname + AbstractHttpClient.normalizeUrlPath(urlPath);
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
	 * 
	 */
	private static normalizeBaseUrl(baseUrl: string): string {
		return baseUrl.replace(/\/+$/, '');
	}
	
	
	/**
	 * 
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
}