import { useState } from 'react';
import { SongItem } from 'mellov_api';
import { getUsersApi } from 'Services/mellowApi';
import { SongFilters, TagElement, SongSortOption } from 'Types/song.types';

interface FetchResult {
	fetched: number;
}

interface UseSongsReturn {
	songs: SongItem[];
	getSongs: () => Promise<FetchResult>;
	loadMoreSongs: () => Promise<FetchResult>;
	addSong: (songItem: SongItem) => Promise<void>;
	updateSong: (songItem: SongItem) => Promise<void>;
	removeSong: (songId: string) => Promise<void>;
}

export function useSongs(
	tags: TagElement[],
	songFilters: SongFilters = { skip: 0, limit: 30, title: '', sort: 'none' }
): UseSongsReturn {
	const [songs, setSongs] = useState<SongItem[]>([]);
	const selectedTagIds = getSelectedTagIds();

	async function fetchSongs(
		opts: {
			skip: number;
			limit: number;
			title: string;
			tags?: string[];
			sort: SongSortOption;
		},
		callback: (data: SongItem[]) => void
	): Promise<FetchResult> {
		const api = await getUsersApi();
		if (!api) return { fetched: 0 };

		return api
			.searchSongs(opts.skip, opts.limit, opts.title, opts.tags, opts.sort)
			.then((data) => {
				callback(data);
				return { fetched: data.length };
			})
			.catch((error) => {
				console.error(error);
				return { fetched: 0 };
			});
	}

	function getSongs(): Promise<FetchResult> {
		const opts = {
			...songFilters,
			tags: selectedTagIds,
		};
		console.log('Fetching songs...');
		return fetchSongs(opts, setSongs);
	}

	function loadMoreSongs(): Promise<FetchResult> {
		const opts = {
			...songFilters,
			skip: songFilters.skip + songs.length,
			tags: selectedTagIds,
		};
		console.log('Fetching more songs...');
		return fetchSongs(opts, (newSongs) => {
			setSongs((songs) => [...songs, ...newSongs]);
		});
	}

	async function addSong(songItem: SongItem): Promise<void> {
		const api = await getUsersApi();
		if (!api) return;

		return api
			.addSong(songItem)
			.then(() => {
				console.log('Song successfully added');
				getSongs(); // temporary?
			})
			.catch((error) => {
				console.error('Error while adding the song: ', error);
			});
	}

	async function updateSong(songItem: SongItem): Promise<void> {
		const api = await getUsersApi();
		if (!api) return;

		return api
			.updateSong(songItem.id, songItem)
			.then((updatedSongItem) => {
				console.log('Song successfully updated');
				setSongs(
					songs.map((songItem) => {
						return songItem.id === updatedSongItem.id ? updatedSongItem : songItem;
					})
				);
			})
			.catch((error) => {
				console.error('Error while updating the song: ', error);
				throw error;
			});
	}

	async function removeSong(songId: string): Promise<void> {
		const api = await getUsersApi();
		if (!api) return;

		return api
			.deleteSong(songId)
			.then(() => {
				console.log('Song successfully removed');
				setSongs(songs.filter((songItem) => songItem.id !== songId));
			})
			.catch((error) => {
				console.error('Error while removing the song: ', error);
			});
	}

	function getSelectedTagIds(): string[] | undefined {
		const tagIds = tags
			.filter((tagElement) => tagElement.selected)
			.map((tagElement) => tagElement.tagItem.id);
		return tagIds.length > 0 ? tagIds : undefined;
	}

	return {
		songs,
		getSongs,
		loadMoreSongs,
		addSong,
		updateSong,
		removeSong,
	};
}
