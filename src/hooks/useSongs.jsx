import React, { useState } from 'react';
import { getUsersApi } from 'Services/mellowApi';

export function useSongs(tags, songFilters = { skip: 0, limit: 30, title: '', sort: 'none' }) {
	const [songs, setSongs] = useState([]);
	const selectedTagIds = getSelectedTagIds();

	async function fetchSongs(opts, callback) {
		const api = await getUsersApi();

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

	function getSongs() {
		const opts = {
			...songFilters,
			tags: selectedTagIds,
		};
		console.log('Fetching songs...');
		return fetchSongs(opts, setSongs);
	}

	function loadMoreSongs() {
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

	async function addSong(songItem) {
		const api = await getUsersApi();
		return api
			.addSong(songItem)
			.then((data) => {
				console.log('Song successfully added');
				getSongs(); // temporary?
			})
			.catch((error) => {
				console.error('Error while adding the song: ', error);
			});
	}

	async function updateSong(songItem) {
		const api = await getUsersApi();
		return api
			.updateSong(songItem.id, songItem)
			.then((updatedSongItem) => {
				console.log('Song successfuly updated');
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

	async function removeSong(songId) {
		const api = await getUsersApi();
		return api
			.deleteSong(songId)
			.then(() => {
				console.log('Song successfuly removed');
				setSongs(songs.filter((songItem) => songItem.id !== songId));
			})
			.catch((error) => {
				console.error('Error while removing the song: ', error);
			});
	}

	function getSelectedTagIds() {
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
