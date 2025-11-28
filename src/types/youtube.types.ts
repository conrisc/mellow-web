/**
 * YouTube search result item
 */
export interface YTItem {
	videoId: string;
	title: string;
	thumbnailUrl?: string;
}

/**
 * YouTube search parameters
 */
export interface YTSearchParams {
	query: string;
	limit?: number;
}
