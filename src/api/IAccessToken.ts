/**
 * OAuth access token information.
 */
export interface IAccessToken {
	accessToken: string;
	
	/**
	 * The refresh token is required when the access token expires.
	 */
	refreshToken: string;
	
	/**
	 * Defines when the access token will expire.
	 */
	expiresIn: number;
}