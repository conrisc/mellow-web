import React from 'react';
import { Button } from 'antd';

export function SpotifyBox() {
	const doSth = () => {
		const access_token = sessionStorage.getItem('spotify_access_token');
		const refresh_token = localStorage.getItem('spotify_refresh_token');

		fetch('https://api.spotify.com/v1/me/playlists', {
			headers: { 'Authorization': 'Bearer ' + access_token },
		})
		.then(response => response.json())
		.then(response => {
			console.log('Spotify profile data: ', response);
		})
	}

	return <Button style={{ display: 'none' }} onClick={doSth}>Do sth</Button>;
}