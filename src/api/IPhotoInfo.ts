import {IUserLinkList} from './IUserLinkList';

/**
 * Information about a single photo. This format is used in multiple places of the unsplash API.
 * @see https://unsplash.com/documentation#photos
 */
export interface IPhotoInfo {
	id: string;
	width: number;
	height: number;
	color: string;
	user: {
		id: string;
		username: string;
		name: string;
		links: IUserLinkList;
	};
	urls: {
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	links: {
		self: string;
		html: string;
		download: string;
	}
}