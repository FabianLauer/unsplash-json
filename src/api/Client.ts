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
	
	
	private client: net.Client;
}