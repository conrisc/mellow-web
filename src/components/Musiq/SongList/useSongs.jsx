import React, { useState } from 'react';
import { UsersApi } from 'what_api';

export function useSongs(tags, songFilters = { skip: 0, limit: 30, title: '', tags: [], sort: 'none' }) {
    const [songs, setSongs] = useState([]);
    const selectedTagIds = tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id);

    function fetchSongs(opts, callback) {
        const api = new UsersApi();
        return api.searchSong(opts)
            .then(data => {
                callback(data);
				return { fetched: data.length }
			})
			.catch(error => {
                console.error(error);
				return { fetched: 0 }
            });
    }

    function getSongs() {
        const opts = {
            ...songFilters,
            tags: selectedTagIds
        };
        console.log('Fetching songs...', songFilters);
        return fetchSongs(opts, setSongs);
    }

    function loadMoreSongs() {
        const opts = {
            ...songFilters,
            skip: songFilters.skip + songs.length,
            tags: selectedTagIds
        };
        console.log('Fetching more songs...', opts);
        return fetchSongs(opts,
            newSongs => {
                setSongs(songs => [...songs, ...newSongs])
            }
        );
    }

    function addSong(songItem) {
        const opts = { songItem };

        const api = new UsersApi();
        return api.addSong(opts)
            .then(newSongId => {
                console.log('Song successfully added');
                getSongs();     // temporary?
            })
            .catch(error => {
                console.error('Error while adding the song: ', error);
            });
    }

    function updateSong(songItem) {
        const opts = { songItem };

        const api = new UsersApi();
        return api.updateSong(opts)
            .then(updatedSongItem => {
                console.log('Song successfuly updated');
                setSongs(
                    songs.map(songItem => {
                        return songItem.id === updatedSongItem.id ?
                            updatedSongItem :
                            songItem;
                    })
                )
            })
            .catch(error => {
                console.error('Error while updating the song: ', error);
                throw error;
			});
    }

    function removeSong(songId) {
        const api = new UsersApi();
        return api.removeSong(songId)
            .then(() => {
                console.log('Song successfuly removed');
                setSongs(songs.filter(songItem => songItem.id !== songId))
            })
            .catch(error => {
                console.error('Error while removing the song: ', error);
            });
    }

	return {
		songs,
		getSongs,
        loadMoreSongs,
        addSong,
        updateSong,
        removeSong
	}
}