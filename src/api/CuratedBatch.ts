import {Client} from './Client';
import {BaseApiObject} from './BaseApiObject';
import {ICuratedBatchInfo} from './ICuratedBatchInfo';
import {Photo} from './Photo';

export class CuratedBatch extends BaseApiObject {
	/**
	 * Loads a curated batch by id and returns it as a new `CuratedBatch` instance.
	 * @param apiClient The API client to use for HTTP requests.
	 * @param id The curated batch id to load.
	 */
	public static async loadById(apiClient: Client, id: number): Promise<CuratedBatch> {
		const response = await apiClient.sendRequest<ICuratedBatchInfo>('/curated_batches/' + id),
			  curatedBatch = new CuratedBatch(apiClient);
		CuratedBatch.applyCuratedBatchInfoToInstance(curatedBatch, response);
		return curatedBatch;
	}
	
	
	/**
	 * Loads a list of curated batches from a URL that responds with an array of `ICuratedBatchInfo` objects.
	 * @see https://unsplash.com/documentation#list-curated batches
	 * @param apiClient The client instance to use for the HTTP request.
	 * @param url The URL that provides the array of `ICuratedBatchInfo` objects.
	 * @param page The page number to retrieve. Optional, default is `1`.
	 * @param perPage The number of photos per page. Optional, default is `10`. 
	 */
	public static async loadFromCuratedBatchInfoListUrl(apiClient: Client, url: string, page?: number, photosPerPage?: number): Promise<CuratedBatch[]> {
		page = typeof page === 'number' ? page : 1;
		photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
		return CuratedBatch.createFromCuratedBatchInfoList(apiClient, await apiClient.sendRequest<ICuratedBatchInfo[]>(url, undefined, {
			page: page,
			per_page: photosPerPage
		}));
	}
	
	
	/**
	 * Loads a list of all curated batches and returns them as an array.
	 * @see https://unsplash.com/documentation#list-curated batches
	 * @param apiClient The client instance to use for the HTTP request.
	 * @param page The page number to retrieve. Optional, default is `1`.
	 * @param perPage The number of photos per page. Optional, default is `10`. 
	 */
	public static async loadCuratedBatchPage(apiClient: Client, page?: number, photosPerPage?: number): Promise<CuratedBatch[]> {
		page = typeof page === 'number' ? page : 1;
		photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
		return CuratedBatch.loadFromCuratedBatchInfoListUrl(apiClient, '/curated_batches', page, photosPerPage);
	}
	
	
	/**
	 * Creates a curated batch for every record in a list of `ICuratedBatchInfo` objects and returns the created curated batches as an array.
	 * @see https://unsplash.com/documentation#list-curated batches
	 */
	public static createFromCuratedBatchInfoList(apiClient: Client, curatedBatchInfoList: ICuratedBatchInfo[]): CuratedBatch[] {
		const curatedBatchArray: CuratedBatch[] = [];
		curatedBatchInfoList.forEach(curatedBatchInfo => {
			const curatedBatch = new CuratedBatch(apiClient);
			CuratedBatch.applyCuratedBatchInfoToInstance(curatedBatch, curatedBatchInfo);
			curatedBatchArray.push(curatedBatch);
		});
		return curatedBatchArray;
	}
	
	
	public getId(): number {
		return this.id;
	}
	
	
	public getPublishingDate(): Date {
		// return a copy of the original date to avoid user code overwriting object data
		return new Date(this.publishedAt.getTime());
	}
	
	
	public getNumDownloads(): number {
		return this.numDownloads;
	}
	
	
	public getSelfLink(): string {
		return this.selfLink;
	}
	
	
	public getHtmlLink(): string {
		return this.htmlLink;
	}
	
	
	public getPhotosLink(): string {
		return this.photosLink;
	}
	
	
	public getDownloadLink(): string {
		return this.downloadLink;
	}
	
	
	/**
	 * Loads all photos of a curated batch and returns them as an array.
	 */
	public async loadAllPhotos(): Promise<Photo[]> {
		return Photo.loadFromPhotoInfoListUrl(this.getApiClient(), this.getPhotosLink());
	}
	
	
	/**
	 * Applies an `ICuratedBatchInfo` object's data to an instance of `CuratedBatch`.
	 */
	private static applyCuratedBatchInfoToInstance(curatedBatch: CuratedBatch, curatedBatchInfo: ICuratedBatchInfo): void {
		curatedBatch.id = curatedBatchInfo.id;
		curatedBatch.publishedAt = new Date(curatedBatchInfo.published_at);
		curatedBatch.numDownloads = curatedBatchInfo.downloads;
		curatedBatch.selfLink = curatedBatchInfo.links.self;
		curatedBatch.htmlLink = curatedBatchInfo.links.html;
		curatedBatch.photosLink = curatedBatchInfo.links.photos;
		curatedBatch.downloadLink = curatedBatchInfo.links.download;
	}
	
	
	private id: number;
	
	
	private publishedAt: Date;
	
	
	private numDownloads: number;
	
	
	private selfLink: string;
	
	
	private htmlLink: string;
	
	
	private photosLink: string;
	
	
	private downloadLink: string;
}