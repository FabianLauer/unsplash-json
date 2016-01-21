import {NodeHttpClient} from './NodeHttpClient';
import {XmlHttpClient} from './XmlHttpClient';
import {HttpMethod} from './HttpMethod';

export abstract class HttpClient<TBaseRequest, TBaseResponse> {
	constructor(private baseUrl: string) { }

	
	public getBaseUrl(): string {
		return this.baseUrl;
	}
	
	
	/**
	 * Creates a HTTP client that works in the current environment.
	 */
	public static createForCurrentEnvironment<TBaseRequest, TBaseResponse>(baseUrl: string): HttpClient<TBaseRequest, TBaseResponse> {
		if (HttpClient.supportsXmlHttp()) {
			return new XmlHttpClient<TBaseRequest, TBaseResponse>(baseUrl);
		} else {
			return new NodeHttpClient<TBaseRequest, TBaseResponse>(baseUrl);
		}
	}
	
	
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's base URL) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 */
	public abstract async send<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params: TBaseRequest): Promise<TResponse>;
	
	
	/**
	 * 
	 */
	protected generateFullUrl(urlPath: string): string {
		return this.baseUrl + '/' + (urlPath || '');
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
	private static supportsXmlHttp(): boolean {
		return typeof XMLHttpRequest === 'function';
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