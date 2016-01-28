import {HttpClient} from './HttpClient';
import {HttpMethod} from './HttpMethod';

export class XmlHttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> extends HttpClient<TBaseRequestHeaders, TBaseRequest, TBaseResponse> {
	/**
	 * Sends a request and returns the response as an object.
	 * @param urlPath The path (relative to the client's base URL) to send the request to.
	 * @param method The HTTP method to send the request with.
	 * @param params A key->value map that holds the parameters to send along with the request.
	 * @param headers A key->value map that holds request headers to be sent.
	 */
	public async send<TResponse extends TBaseResponse>(urlPath: string, method: HttpMethod, params?: TBaseRequest, headers?: TBaseRequestHeaders): Promise<TResponse> {
		const request = new XMLHttpRequest(),
			  requestPromise = this.waitForRequestComplete(request);
		// set all headers
		if (typeof headers === 'object' && headers !== null) {
			for (let name in headers) {
				request.setRequestHeader(name, (<any>headers)[name]);
			}
		}
		// open and send the request
		request.open(HttpClient.httpMethodToString(method), this.generateFullUrl(urlPath), true);
		request.send(params);
		// wait for the request to finish
		await requestPromise;
		return JSON.parse(request.responseText);
	}
	
	
	private async waitForRequestComplete(request: XMLHttpRequest): Promise<void> {
		return new Promise<void>((resolve: () => void, reject: (reason: any) => void) => {
			request.addEventListener('readystatechange', () => {
				if (request.readyState === 4) {
					resolve();
				}
			});
			request.addEventListener('error', (event: ErrorEvent) => reject(event));
			request.addEventListener('abort', (event: Event) => reject(event));
		});
	}
}