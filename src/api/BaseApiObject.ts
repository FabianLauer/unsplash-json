import {Client} from './Client';

export abstract class BaseApiObject {
	/**
	 * @param apiClient The api client instance this object belongs to.
	 */
	constructor(private apiClient: Client) { }
	
	
	public getApiClient(): Client {
		return this.apiClient;
	}
}