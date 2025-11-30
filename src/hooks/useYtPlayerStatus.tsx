import React, { useEffect, useState } from 'react';
import { PlayerStatus, VideoData } from 'Types/player.types';

/**
 * Player status enum matching YouTube IFrame API states
 */
enum YtPlayerStatus {
	UNSTARTED = -1,
	ENDED = 0,
	PLAYING = 1,
	PAUSED = 2,
	LOADING = 3,
	// 4? not needed
	CUED = 5,
}

export function useYtPlayerStatus(ytPlayer) {
	const [status, setStatus] = useState<PlayerStatus | null>(null);
	const [videoData, setVideoData] = useState<VideoData | null>(null);

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

			switch (data) {
				case YtPlayerStatus.UNSTARTED:
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.UNSTARTED);
					treatAsFailed = setTimeout(() => {
						setStatus(PlayerStatus.FAILED);
					}, 2000);
					break;
				case YtPlayerStatus.ENDED:
					setStatus(PlayerStatus.ENDED);
					break;
				case YtPlayerStatus.PLAYING:
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.LOADED);
					break;
				case YtPlayerStatus.PAUSED:
					setStatus(PlayerStatus.PAUSED);
					break;
				case YtPlayerStatus.LOADING:
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.LOADING);
				case YtPlayerStatus.CUED:
				default:
			}

			updateVideoData(target.getVideoData());
		}

		ytPlayer.addEventListener('onStateChange', stateListener);

		return () => {
			ytPlayer.removeEventListener('onStateChange', stateListener);
		};
	}, [ytPlayer]);

	function updateVideoData(playerData?: { video_id: string; title: string }) {
		if (!playerData) setVideoData(null);
		else if (videoData?.videoId !== playerData.video_id) {
			setVideoData({
				videoId: playerData.video_id,
				title: playerData.title,
			});
		}
	}

	return { status, videoData };
}
