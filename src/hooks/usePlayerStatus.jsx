import React, { useEffect, useState } from 'react';

export function usePlayerStatus(ytPlayer) {
	const [status, setStatus] = useState('')

	useEffect(() => {
		if (!ytPlayer) return;

		let currentVideoId = '';
		let retrier = null;
		function stateListener({ data, target }) {
			const videoId = target.getVideoData().video_id;
			if (currentVideoId !== videoId) {
				currentVideoId = videoId;
				setStatus('INITIALIZED');
			}

			switch(data) {
				case 1: 		// PLAYING
					clearTimeout(retrier);
					setStatus('LOADED');
					break;
				case -1:		// UNSTARTED
					clearTimeout(retrier);
					setStatus('RETRYING');
					retrier = setTimeout(() => {
						setStatus('FAILED');
					}, 2000);
					break;
				case 0:			// ENDED
					setStatus('ENDED')
					break;
				case 2:	// PAUSED
					setStatus('PAUSED')
					break;
				case 3:	// LOADING
					clearTimeout(retrier);
				case 5:	// CUED
				default:
			}
		}

		ytPlayer.addEventListener('onStateChange', stateListener);

		return () => {
			ytPlayer.removeEventListener('onStateChange', stateListener);
		}
	}, [ytPlayer]);

	return status; // INITIALIZED, LOADED, RETRYING, FAILED, ENDED
}
