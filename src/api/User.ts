import {Client} from './Client';
import {BaseApiObject} from './BaseApiObject';
import {IGetUserInfoResponse} from './IGetUserInfoResponse';

export class User extends BaseApiObject {
	/**
	 * Loads a user by username and returns a new `User` instance for that user.
	 */
	public static async loadByUsername(apiClient: Client, username: string): Promise<User> {
		const response = await apiClient.sendRequest<IGetUserInfoResponse>('/users/' + username),
			  user = new User(apiClient);
		User.applyUserInfoResponseToInstance(user, response);
		return user;
	}
	
	
	public getUsername(): string {
		return this.username;
	}
	
	
	public getFirstName(): string {
		return this.firstName;
	}
	
	
	public getLastName(): string {
		return this.lastName;
	}
	
	
	public getPortfolioUrl(): string {
		return this.portfolioUrl;
	}
	
	
	public getNumDownloads(): number {
		return this.numDownloads;
	}
	
	
	public getSmallProfileImageUrl(): string {
		return this.smallProfileImageUrl;
	}
	
	
	public getMediumProfileImageUrl(): string {
		return this.meduimProfileImageUrl;
	}
	
	
	public getLargeProfileImageUrl(): string {
		return this.largeProfileImageUrl;
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
	
	
	public getLikesLink(): string {
		return this.likesLink;
	}
	
	
	/**
	 * Applies a user info response object to a user instance.
	 */
	private static applyUserInfoResponseToInstance(user: User, userInfoResponse: IGetUserInfoResponse): void {
		user.username = userInfoResponse.username;
		user.firstName = userInfoResponse.first_name;
		user.lastName = userInfoResponse.last_name;
		user.portfolioUrl = userInfoResponse.portfolio_url;
		user.numDownloads = userInfoResponse.downloads;
		user.smallProfileImageUrl = userInfoResponse.profile_image.small;
		user.meduimProfileImageUrl = userInfoResponse.profile_image.medium;
		user.largeProfileImageUrl = userInfoResponse.profile_image.large;
		user.selfLink = userInfoResponse.links.self;
		user.htmlLink = userInfoResponse.links.html;
		user.photosLink = userInfoResponse.links.photos;
		user.likesLink = userInfoResponse.links.likes;
	}
	
	
	private username: string;
	
	
	private firstName: string;
	
	
	private lastName: string;
	
	
	private portfolioUrl: string;
	
	
	private numDownloads: number;
	
	
	private smallProfileImageUrl: string;
	
	
	private meduimProfileImageUrl: string;
	
	
	private largeProfileImageUrl: string;
	
	
	private selfLink: string;
	
	
	private htmlLink: string;
	
	
	private photosLink: string;
	
	
	private likesLink: string;
}