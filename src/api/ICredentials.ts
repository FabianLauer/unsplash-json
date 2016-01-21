/**
 * API credentials.
 */
export interface ICredentials {
	/**
	 * The application id. This is required for every request.
	 */
	applicationId: string;
	
	/**
	 * A secret key required for OAuth authentification.
	 */
	secret?: string;
	
	/**
	 * The callback URL for OAuth authentification.
	 */
	callbackUrl: string;
}