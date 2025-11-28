/**
 * Tag interface
 */
export interface Tag {
	id?: string;
	name: string;
	color?: string;
}

/**
 * Song/Track interface
 */
export interface Song {
	id: string;
	title: string;
	url: string;
	tags: Tag[];
	dateAdded: string | Date;
}

/**
 * Song filter parameters
 */
export interface SongFilters {
	title: string;
	skip: number;
	limit: number;
	sort: SongSortOption;
}

/**
 * Available sort options for songs
 */
export type SongSortOption =
	| 'none'
	| 'title_asc'
	| 'title_desc'
	| 'added_date_asc'
	| 'added_date_desc';

/**
 * Tag element with selection state
 */
export interface TagElement {
	tagItem: Tag;
	selected: boolean;
}

/**
 * Song search parameters for API
 */
export interface SongSearchParams {
	skip?: number;
	limit?: number;
	title?: string;
	tags?: string[];
	sort?: SongSortOption;
}
