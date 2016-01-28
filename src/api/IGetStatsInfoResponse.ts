/**
 * Describes the response to a get stats request.
 * @see https://unsplash.com/documentation#stats
 */
export interface IGetStatsInfoResponse {
	photo_downloads: number;
	batch_downloads: number;
}