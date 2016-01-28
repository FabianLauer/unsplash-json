/**
 * Information about a single category.
 * @see https://unsplash.com/documentation#categories
 */
export interface ICategoryInfo {
	id: number;
	title: string;
	photo_count: number;
	links: {
		self: string;
		photos: string;
	}
}