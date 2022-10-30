const spotifyApiUrl = 'https://api.spotify.com/v1';

export function getMyPlaylists() {
	console.log('Fetching my spotify playlists')
	return fetch(`${spotifyApiUrl}/me/playlists`, {
		headers: authorizationHeaders(),
	})
		.then(response => response.json())
		.then(response => response.items)
		.catch((error) => {
			console.warn('Failed to fetch my playlists', error)
			return [];
		});
}

export function getSongs(playlistId) {
	console.log('Fetching songs')
	return fetch(`${spotifyApiUrl}/playlists/${playlistId}/tracks`, {
		headers: authorizationHeaders(),
	})
		.then(response => response.json())
		.then(response => response.items)
		.catch((error) => {
			console.warn('Failed to fetch songs', error)
			return [];
		});
}

function authorizationHeaders() {
	const access_token = sessionStorage.getItem('spotify_access_token');
	// const refresh_token = localStorage.getItem('spotify_refresh_token');

	return { 'Authorization': 'Bearer ' + access_token };
}
