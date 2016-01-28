/**
 * Describes the response returned from requests against https://api.unsplash.com/users/<<username>>.
 */
export interface IGetUserInfoResponse {
	username: string;
	first_name: string;
	last_name: string;
	portfolio_url: string;
	downloads: number;
	profile_image: {
		small: string;
		medium: string;
		large: string;
	};
	links: {
		self: string;
		html: string;
		photos: string;
		likes: string;
	};
}