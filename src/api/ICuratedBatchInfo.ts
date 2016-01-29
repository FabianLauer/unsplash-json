/**
 * Information about a single curated batch.
 * @see https://unsplash.com/documentation#curated-batches
 */
export interface ICuratedBatchInfo {
	id: number;
	published_at: string;
	downloads: number;
	curator: {
		id: string;
		username: string;
		name: string;
		bio: string;
		links: {
			self: string;
			html: string;
			photos: string;
			likes: string;
		};
	};
	links: {
		self: string;
		html: string;
		photos: string;
		download: string;
	};
}