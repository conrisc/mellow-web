import React, { useEffect, useState } from 'react';
import { PlayerStatus } from 'Types/player.types';
import { VideoData } from 'Types/player.types';
import { AudioPlayer } from 'Types/player.types';

const AUDIO_ELEMENT_EVENTS = [
	'abort', // Fired when the resource was not fully loaded, but not as the result of an error.
	'canplay', // Fired when the user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
	'canplaythrough', // Fired when the user agent can play the media, and estimates that enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
	'durationchange', // Fired when the duration property has been updated.
	'emptied', // Fired when the media has become empty; for example, when the media has already been loaded (or partially loaded), and the HTMLMediaElement.load() method is called to reload it.
	'encrypted', // Fired when initialization data is found in the media that indicates the media is encrypted.
	'ended', // Fired when playback stops when end of the media (<audio> or <video>) is reached or because no further data is available.
	'error', // Fired when the resource could not be loaded due to an error.
	'loadeddata', // Fired when the first frame of the media has finished loading.
	'loadedmetadata', // Fired when the metadata has been loaded.
	'loadstart', // Fired when the browser has started to load a resource.
	'pause', // Fired when a request to pause play is handled and the activity has entered its paused state, most commonly occurring when the media's HTMLMediaElement.pause() method is called.
	'play', // Fired when the paused property is changed from true to false, as a result of the HTMLMediaElement.play() method, or the autoplay attribute.
	'playing', // Fired when playback is ready to start after having been paused or delayed due to lack of data.
	'progress', // Fired periodically as the browser loads a resource.
	'ratechange', // Fired when the playback rate has changed.
	'seeked', // Fired when a seek operation completes.
	'seeking', // Fired when a seek operation begins.
	'stalled', // Fired when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
	'suspend', // Fired when the media data loading has been suspended.
	// 'timeupdate', // Fired when the time indicated by the currentTime property has been updated.
	'volumechange', // Fired when the volume has changed.
	'waiting', // Fired when playback has stopped because of a temporary lack of data.
	'waitingforkey', // Fired when playback is first blocked while waiting for a key.
] as const

export function useAudioPlayerStatus(audioPlayer: AudioPlayer) {
	const [status, setStatus] = useState<PlayerStatus | null>(null);
	const [videoData, setVideoData] = useState<VideoData | null>(null);

	useEffect(() => {
		if (!audioPlayer) return;

		let currentVideoId = '';
		let treatAsFailed = null;

		function stateListener({ type, target }) {
			// console.debug('Audio Player Event:', type);
			const videoData = audioPlayer.getVideoData();
			if (currentVideoId !== videoData.videoId) {
				currentVideoId = videoData.videoId;
				setStatus(PlayerStatus.INITIALIZED);
			}

			switch(type) {
				case 'error':
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.UNSTARTED);
					treatAsFailed = setTimeout(() => {
						setStatus(PlayerStatus.FAILED);
					}, 2000);
					break;
				case 'ended':
					setStatus(PlayerStatus.ENDED)
					break;
				case 'play':
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.LOADED);
					break;
				case 'pause':
					setStatus(PlayerStatus.PAUSED)
					break;
				case 'loadstart':
					clearTimeout(treatAsFailed);
					setStatus(PlayerStatus.LOADING)
				default:
			}

			updateVideoData(audioPlayer.getVideoData());
		}

		AUDIO_ELEMENT_EVENTS.forEach(eventType => {
			audioPlayer.element.addEventListener(eventType, stateListener);
		});


		return () => {
			AUDIO_ELEMENT_EVENTS.forEach(eventType => {
				audioPlayer.element.removeEventListener(eventType, stateListener);
			});
		};
	}, [audioPlayer]);

	function updateVideoData(playerData?: VideoData) {
		if (!playerData) setVideoData(null);
		else if (videoData?.videoId !== playerData.videoId) {
			setVideoData({
				videoId: playerData.videoId,
				title: playerData.title,
			});
		}
	}

	return { status, videoData };
}
