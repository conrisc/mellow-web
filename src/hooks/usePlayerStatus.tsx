import React, { useEffect, useState } from 'react';

export enum PlayerStatus {
	INITIALIZED,
	UNSTARTED,
	FAILED,
	ENDED,
	LOADED,
	PAUSED,
	LOADING,
}

export function usePlayerStatus(ytPlayer) {
	const [status, setStatus] = useState<PlayerStatus | null>(null)

	useEffect(() => {
		if (!ytPlayer) return;

		let currentVideoId = '';
		let treatAsFailed = null;
		function stateListener({ data, target }) {
			const videoId = target.getVideoData().video_id;
			if (currentVideoId !== videoId) {
				currentVideoId = videoId;
				setStatus(PlayerStatus.INITIALIZED);
			}

			switch(data) {
				case -1: // UNSTARTED
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.UNSTARTED);
					treatAsFailed = setTimeout(() => {
						setStatus(PlayerStatus.FAILED);
					}, 2000);
					break;
				case 0:	// ENDED
					setStatus(PlayerStatus.ENDED)
					break;
				case 1:	// PLAYING
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.LOADED);
					break;
				case 2:	// PAUSED
					setStatus(PlayerStatus.PAUSED)
					break;
				case 3:	// LOADING
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.LOADING)
				case 5:	// CUED
				default:
			}
		}

		ytPlayer.addEventListener('onStateChange', stateListener);

		return () => {
			ytPlayer.removeEventListener('onStateChange', stateListener);
		}
	}, [ytPlayer]);

	return status;
}
