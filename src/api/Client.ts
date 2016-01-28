import {ICredentials} from './ICredentials';
import {IAccessToken} from './IAccessToken';
import * as net from '../net';

/**
 * Unsplash API client.
 */
export class Client {
	/**
	 * Creates an API client object.
	 */
	constructor(private credentials: ICredentials, private accessToken?: IAccessToken) { }
	
	
	/**
	 * The HTTP client. The created client supports whatever is available in the current environment (either `XMLHttpRequest` or node HTTP requests).
	 */
	private client = net.HttpClient.createForCurrentEnvironment<any, any, any>('api.unsplash.com', true);
}