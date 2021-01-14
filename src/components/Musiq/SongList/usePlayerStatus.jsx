import React, { useEffect, useState } from 'react';

export function usePlayerStatus(ytPlayer) {
	const [status, setStatus] = useState('')

	useEffect(() => {
		if (!ytPlayer) return;

		let currentVideoId = '';
		let retrier = null;
		function stateListener({ data, target }) {
			if (currentVideoId !== target.getVideoData().video_id) {
				currentVideoId = target.getVideoData().video_id;
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
					}, 1500);
					break;
				case 0:			// ENDED
					setStatus('ENDED')
					break;
				// case 2:	// PAUSED
				// case 3:	// LOADING
				// case 5:	// CUED
				// default:
			}
		}

		ytPlayer.addEventListener('onStateChange', stateListener);
	}, [ytPlayer]);

	return status; // INITIALIZED, LOADED, RETRYING, FAILED, ENDED
}
