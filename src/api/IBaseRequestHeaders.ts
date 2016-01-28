/**
 * Describes request headers sent along with every request.
 */
export interface IBaseRequestHeaders {
	/**
	 * When this contains the application ID (see example below), the request can perform public actions. Refer to the original unsplash API docs for more.
	 * @see https://unsplash.com/documentation#public-actions
	 * @example
	 *     Authorization: Client-ID YOUR_APPLICATION_ID
	 */
	Authorization: string;
}