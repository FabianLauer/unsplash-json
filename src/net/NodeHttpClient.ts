/// <reference path="../../typings/node" />
import * as http from 'http';
import * as https from 'https';
import * as qs from 'querystring';
import {AbstractHttpClient} from './AbstractHttpClient';
import {HttpMethod} from './HttpMethod';

export class NodeHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends AbstractHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's hostname) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 * @param headers A key->value map that holds request headers to be sent.
	 */
	protected async sendRequestConcrete<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse> {
		const responseText = await this.sendNodeRequest(urlPath, method, params, headers);
		return JSON.parse(responseText);
	}
	
	
	/**
	 * Returns the request module (either node's `http` or `https` module) to use, depending on whether this http client uses HTTPS or plain HTTP.
	 */
	private getRequestModule(): typeof http | typeof https {
		if (this.getUseHttps()) {
			return https;
		} else {
			return http;
		}
	}
	
	
	/**
	 * Sends a node.js request and returns a promise that is resolved with the complete response text as soon as the request has completed.
	 */
	private async sendNodeRequest(urlPath: string, method: HttpMethod, params: TBaseRequest, headers: TBaseRequestHeaders): Promise<string> {
		return new Promise<string>((resolve: (responseText: string) => void, reject: (reason: any) => void) => {
			const request = this.getRequestModule().request(this.createRequestOptions(urlPath, method, params, headers), response => {
				var responseText = '';
				response.on('data', (chunk: string) => {
					responseText += chunk;
				});
				response.on('end', () => {
					this.storeAllResponseHeaders(response);
					resolve(responseText);
				});
			});
			request.on('error', (err: any) => {
				reject(err);
			});
			request.end();
		});
	}
	
	
	/**
	 * Creates a request options object for a certain request configuration.
	 */
	private createRequestOptions(urlPath: string, method: HttpMethod, params: TBaseRequest, headers: TBaseRequestHeaders): http.RequestOptions {
		return <http.RequestOptions>{
			method: AbstractHttpClient.httpMethodToString(method).toUpperCase(),
			hostname: this.getHostName(),
			path: urlPath + '?' + qs.stringify(params),
			headers: headers
		};
	}
	
	
	/**
	 * Stores response headers so that users of this class can access them.
	 */
	private storeAllResponseHeaders(response: http.IncomingMessage): void {
		for (let name in response.headers) {
			this.setResponseHeaderFromLastRequest(name, response.headers[name]);
		}
	}
}