import React, { useState } from 'react';
import { UsersApi } from 'mellov_api';
import { authorizedRequest } from '../../../services/apiConfig.service';

export function useSongs(tags, songFilters = { skip: 0, limit: 30, title: '', tags: [], sort: 'none' }) {
    const [songs, setSongs] = useState([]);
    const selectedTagIds = tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id);

    function fetchSongs(opts, callback) {
        const api = new UsersApi();

        return authorizedRequest(() => api.searchSongs(opts))
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
        console.log('Fetching songs...');
        return fetchSongs(opts, setSongs);
    }

    function loadMoreSongs() {
        const opts = {
            ...songFilters,
            skip: songFilters.skip + songs.length,
            tags: selectedTagIds
        };
        console.log('Fetching more songs...');
        return fetchSongs(opts,
            newSongs => {
                setSongs(songs => [...songs, ...newSongs])
            }
        );
    }

    function addSong(songItem) {
        const api = new UsersApi();
        return authorizedRequest(() => api.addSong(songItem))
            .then(data => {
                console.log('Song successfully added');
                getSongs();     // temporary?
            })
            .catch(error => {
                console.error('Error while adding the song: ', error);
            });
    }

    function updateSong(songItem) {
        const api = new UsersApi();
        return authorizedRequest(() => api.updateSong(songItem.id, songItem))
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
        return authorizedRequest(() => api.deleteSong(songId))
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