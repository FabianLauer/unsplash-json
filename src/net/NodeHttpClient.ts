/// <reference path="../../typings/node" />
import * as http from 'http';
import {HttpClient} from './HttpClient';
import {HttpMethod} from './HttpMethod';

export class NodeHttpClient<TBaseRequest, TBaseResponse> extends HttpClient<TBaseRequest, TBaseResponse> {
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's base URL) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 */
	public async send<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params: TBaseRequest): Promise<TResponse> {
		const responseText = await this.sendRequest(urlPath, method, params);
		return JSON.parse(responseText);
	} 
	
	
	private async sendRequest(urlPath: string, method: HttpMethod, params: TBaseRequest): Promise<string> {
		return new Promise<string>((resolve: (responseText: string) => void, reject: (reason: any) => void) => {
			const req = http.request(this.createRequestOptions(urlPath, method), response => {
				response.on('data', (chunk: string) => {
					resolve(chunk);
				});
			});
			req.write(params);
			req.end();
		});
	}
	
	
	private createRequestOptions(urlPath: string, method: HttpMethod): http.RequestOptions {
		const options = {
			method: HttpClient.httpMethodToString(method),
			hostname: this.getBaseUrl(),
			path: urlPath
		};
		return options;
	}
}