import {Client} from './Client';
import {BaseApiObject} from './BaseApiObject';
import {IGetStatsInfoResponse} from './IGetStatsInfoResponse';
import {Photo} from './Photo';

export class Stats extends BaseApiObject {
	/**
	 * Loads statistics information.
	 * @param apiClient The api client object to use for requests.
	 */
	public static async load(apiClient: Client): Promise<Stats> {
		const response = await apiClient.sendRequest<IGetStatsInfoResponse>('/stats/total'),
			  stats = new Stats(apiClient);
		Stats.applyStatsInfoResponseToInstance(stats, response);
		return stats;
	}
	
	
	public getPhotoDownloads(): number {
		return this.photoDownloads;
	}
	
	
	public getBatchDownloads(): number {
		return this.batchDownloads;
	}
	
	
	/**
	 * Applies a stats info object's data to a `Stats` instance.
	 */
	private static applyStatsInfoResponseToInstance(stats: Stats, statsInfo: IGetStatsInfoResponse): void {
		stats.photoDownloads = statsInfo.photo_downloads;
		stats.batchDownloads = statsInfo.batch_downloads;
	}
	
	
	
	private photoDownloads: number;
	
	
	private batchDownloads: number;
}	