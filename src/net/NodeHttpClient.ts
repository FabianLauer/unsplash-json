/// <reference path="../../typings/node" />
import * as http from 'http';
import {HttpClient} from './HttpClient';
import {HttpMethod} from './HttpMethod';

export class NodeHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends HttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's base URL) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 * @param headers A key->value map that holds request headers to be sent.
	 */
	public async send<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse> {
		const responseText = await this.sendRequest(urlPath, method, params, headers);
		return JSON.parse(responseText);
	} 
	
	
	private async sendRequest(urlPath: string, method: HttpMethod, params: TBaseRequest, headers: TBaseRequestHeaders): Promise<string> {
		return new Promise<string>((resolve: (responseText: string) => void, reject: (reason: any) => void) => {
			const request = http.request(this.createRequestOptions(urlPath, method, headers), response => {
				response.on('data', (chunk: string) => {
					resolve(chunk);
				});
			});
			request.write(params);
			request.end();
		});
	}
	
	
	private createRequestOptions(urlPath: string, method: HttpMethod, headers: TBaseRequestHeaders): http.RequestOptions {
		const options = {
			method: HttpClient.httpMethodToString(method),
			hostname: this.getBaseUrl(),
			path: urlPath,
			headers: headers
		};
		return options;
	}
}