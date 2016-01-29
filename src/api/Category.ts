import {Client} from './Client';
import {BaseApiObject} from './BaseApiObject';
import {ICategoryInfo} from './ICategoryInfo';
import {Photo} from './Photo';

export class Category extends BaseApiObject {
	/**
	 * Loads a category by id and returns it as a new `Category` instance.
	 * @param apiClient The API client to use for HTTP requests.
	 * @param id The category id to load.
	 */
	public static async loadById(apiClient: Client, id: number): Promise<Category> {
		const response = await apiClient.sendRequest<ICategoryInfo>('/categories/' + id),
			  category = new Category(apiClient);
		Category.applyCategoryInfoToInstance(category, response);
		return category;
	}
	
	
	/**
	 * Loads a list of categories from a URL that responds with an array of `ICategoryInfo` objects.
	 * @see https://unsplash.com/documentation#list-categories
	 * @param apiClient The client instance to use for the HTTP request.
	 * @param url The URL that provides the array of `ICategoryInfo` objects.
	 */
	public static async loadFromCategoryInfoListUrl(apiClient: Client, url: string): Promise<Category[]> {
		return Category.createFromCategoryInfoList(apiClient, await apiClient.sendRequest<ICategoryInfo[]>(url));
	}
	
	
	/**
	 * Loads a list of all categories and returns them as an array.
	 * @see https://unsplash.com/documentation#list-categories
	 * @param apiClient The client instance to use for the HTTP request.
	 */
	public static async loadAll(apiClient: Client): Promise<Category[]> {
		return Category.loadFromCategoryInfoListUrl(apiClient, '/categories');
	}
	
	
	/**
	 * Creates a category for every record in a list of `ICategoryInfo` objects and returns the created categories as an array.
	 * @see https://unsplash.com/documentation#list-categories
	 */
	public static createFromCategoryInfoList(apiClient: Client, categoryInfoList: ICategoryInfo[]): Category[] {
		const categoryArray: Category[] = [];
		categoryInfoList.forEach(categoryInfo => {
			const category = new Category(apiClient);
			Category.applyCategoryInfoToInstance(category, categoryInfo);
			categoryArray.push(category);
		});
		return categoryArray;
	}
	
	
	public getId(): number {
		return this.id;
	}
	
	
	public getTitle(): string {
		return this.title;
	}
	
	
	public getPhotoCount(): number {
		return this.photoCount;
	}
	
	
	public getSelfLink(): string {
		return this.selfLink;
	}
	
	
	public getPhotosLink(): string {
		return this.photosLink;
	}
	
	
	/**
	 * Loads all photos of a category and returns them as an array.
	 * @param page The page number to retrieve. Optional, default is `1`.
	 * @param perPage The number of photos per page. Optional, default is `10`. 
	 */
	public async loadPhotoPage(page?: number, photosPerPage?: number): Promise<Photo[]> {
		page = typeof page === 'number' ? page : 1;
		photosPerPage = typeof photosPerPage === 'number' ? photosPerPage : 10;
		return Photo.loadFromPhotoInfoListUrl(this.getApiClient(), this.getPhotosLink(), {
			page: page,
			per_page: photosPerPage
		});
	}
	
	
	/**
	 * Applies a user info response object to a user instance.
	 */
	private static applyCategoryInfoToInstance(category: Category, categoryInfo: ICategoryInfo): void {
		category.id = categoryInfo.id;
		category.title = categoryInfo.title;
		category.photoCount = categoryInfo.photo_count;
		category.selfLink = categoryInfo.links.self;
		category.photosLink = categoryInfo.links.photos;
	}
	
	
	private id: number;
	
	
	private title: string;
	
	
	private photoCount: number;
	
	
	private selfLink: string;
	
	
	private photosLink: string;
}