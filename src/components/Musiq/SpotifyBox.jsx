import React, { useEffect, useState } from 'react';
import { getMyPlaylists, getSongs } from '../../services/spotify';

export function SpotifyBox() {
	const [myPlaylists, setMyPlaylists] = useState([]);
	const [songs, setSongs] = useState([]);

	useEffect(() => {
		loadData();
	}, [])

	async function loadData() {
		const playlists = await getMyPlaylists();
		setMyPlaylists(playlists);
	}

	async function loadSongs(playlistId) {
		const songs = await getSongs(playlistId);
		setSongs(songs);
	}

	return (
		<>
			Playlists:
			<ul>
				{myPlaylists.map(playlist => <li key={playlist.id} onClick={() => loadSongs(playlist.id)}>{playlist.id}</li>)}
			</ul>
			Songs:
			<ul>
				{songs.map(song => <li key={song.track.id}>
					{song.track.artists.map(artist => artist.name).join(', ')} - {song.track.name}
				</li>)}
			</ul>
		</>
	);
}
