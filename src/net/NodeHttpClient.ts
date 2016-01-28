/// <reference path="../../typings/node" />
import * as http from 'http';
import * as https from 'https';
import * as qs from 'querystring';
import {AbstractHttpClient} from './AbstractHttpClient';
import {HttpMethod} from './HttpMethod';

export class NodeHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
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
	
	
	private getRequestModule(): typeof http | typeof https {
		if (this.getUseHttps()) {
			return https;
		} else {
			return http;
		}
	}
	
	
	private async sendRequest(urlPath: string, method: HttpMethod, params: TBaseRequest, headers: TBaseRequestHeaders): Promise<string> {
		return new Promise<string>((resolve: (responseText: string) => void, reject: (reason: any) => void) => {
			const request = this.getRequestModule().request(this.createRequestOptions(urlPath, method, headers), response => {
				response.on('data', (chunk: string) => {
					resolve(chunk);
				});
			});
			request.on('error', (err: any) => {
				reject(err);
			});
			request.write(qs.stringify(params));
			request.end();
		});
	}
	
	
	private createRequestOptions(urlPath: string, method: HttpMethod, headers: TBaseRequestHeaders): http.RequestOptions {
		return <http.RequestOptions>{
			method: AbstractHttpClient.httpMethodToString(method).toUpperCase(),
			hostname: this.getBaseUrl(),
			path: urlPath,
			headers: headers
		};
	}
}