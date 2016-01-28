import {Client} from './Client';
import {BaseApiObject} from './BaseApiObject';
import {IPhotoInfo} from './IPhotoInfo';

export class Photo extends BaseApiObject {
	/**
	 * Loads a photo by id and returns a new `Photo` instance for that photo.
	 */
	public static async loadById(apiClient: Client, id: string): Promise<Photo> {
		const response = await apiClient.sendRequest<IPhotoInfo>('/photos/' + id),
			  photo = new Photo(apiClient);
		Photo.applyPhotoInfoToInstance(photo, response);
		return photo;
	}
	
	
	/**
	 * Loads a list of photos from a URL that responds with an array of `IPhotoInfo` objects.
	 * @see https://unsplash.com/documentation#list-photos
	 * @param apiClient The client instance to use for the HTTP request.
	 * @param url The URL that provides the array of `IPhotoInfo` objects.
	 */
	public static async loadFromPhotoInfoListUrl(apiClient: Client, url: string): Promise<Photo[]> {
		return Photo.createFromPhotoInfoList(apiClient, await apiClient.sendRequest<IPhotoInfo[]>(url));
	}
	
	
	/**
	 * Creates a photo for every record in a list of `IPhotoInfo` objects and returns the created photos as an array.
	 * @see https://unsplash.com/documentation#list-photos
	 */
	public static createFromPhotoInfoList(apiClient: Client, photoInfoList: IPhotoInfo[]): Photo[] {
		const photoArray: Photo[] = [];
		photoInfoList.forEach(photoInfo => {
			const photo = new Photo(apiClient);
			Photo.applyPhotoInfoToInstance(photo, photoInfo);
			photoArray.push(photo);
		});
		return photoArray;
	}
	
	
	public getId(): string {
		return this.id;
	}
	
	
	public getWidth(): number {
		return this.width;
	}
	
	
	public getHeight(): number {
		return this.height;
	}
	
	
	public getColor(): string {
		return this.color;
	}
	
	
	public getThumbUrl(): string {
		return this.thumbUrl;
	}
	
	
	public getSmallUrl(): string {
		return this.smallUrl;
	}
	
	
	public getRegularUrl(): string {
		return this.regularUrl;
	}
	
	
	public getFullUrl(): string {
		return this.fullUrl;
	}
	
	
	public getSelfLink(): string {
		return this.selfLink;
	}
	
	
	public getHtmlLink(): string {
		return this.htmlLink;
	}
	
	
	public getDownloadLink(): string {
		return this.downloadLink;
	}
	
	
	/**
	 * Applies a user info response object to a user instance.
	 */
	private static applyPhotoInfoToInstance(photo: Photo, photoInfo: IPhotoInfo): void {
		photo.id = photoInfo.id;
		photo.width = photoInfo.width;
		photo.height = photoInfo.height;
		photo.color = photoInfo.color;
		photo.userRef = photoInfo.user;
		photo.fullUrl = photoInfo.urls.full;
		photo.regularUrl = photoInfo.urls.regular;
		photo.smallUrl = photoInfo.urls.small;
		photo.thumbUrl = photoInfo.urls.thumb;
		photo.selfLink = photoInfo.links.self;
		photo.htmlLink = photoInfo.links.html;
		photo.downloadLink = photoInfo.links.download;
	}
	
	
	private id: string;
	
	
	private userRef: any; /// TODO: Interface!
	
	
	private width: number;
	
	
	private height: number;
	
	
	private color: string;
	
	
	private thumbUrl: string;
	
	
	private smallUrl: string;
	
	
	private regularUrl: string;
	
	
	private fullUrl: string;
	
	
	private selfLink: string;
	
	
	private htmlLink: string;
	
	
	private downloadLink: string;
}