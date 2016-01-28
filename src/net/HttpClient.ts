import {AbstractHttpClient} from './AbstractHttpClient';
import {NodeHttpClient} from './NodeHttpClient';
import {XmlHttpClient} from './XmlHttpClient';
import {HttpMethod} from './HttpMethod';

export abstract class HttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
	/**
	 * Creates a HTTP client that works in the current environment.
	 */
	public static createForCurrentEnvironment<TBaseRequestHeaders, TBaseRequest, TBaseResponse>(baseUrl: string): HttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
		if (HttpClient.supportsXmlHttp()) {
			return new XmlHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse>(baseUrl);
		} else {
			return new NodeHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse>(baseUrl);
		}
	}
}