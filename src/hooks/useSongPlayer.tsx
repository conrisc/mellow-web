import React, { useCallback, useRef, useEffect, ReactElement } from 'react';
import { debounce } from 'throttle-debounce';
import { SongItem } from 'mellov_api';
import { PlayerStatus } from './usePlayerStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc, faExclamationCircle, faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

class CancelledActionError extends Error {
	constructor(message: string = 'Action cancelled') {
		super(message);
		this.name = 'CancelledActionError';
	}
}

interface UseSongPlayerProps {
	songs: SongItem[];
	currentlyPlaying: number | null;
	playerType: 'audio' | 'yt';
	audioPlayer: any;
	ytPlayer: any;
	playerStatus: PlayerStatus;
	getYtItems: (title: string) => Promise<any[]>;
	onPlayNext: () => void;
}

interface UseSongPlayerReturn {
	playSong: (fromYT?: boolean, ytIndex?: number) => Promise<void>;
	handleSongClick: (songIndex: number) => void;
	getIconForCurrentSong: () => IconProp;
}

export function useSongPlayer({
	songs,
	currentlyPlaying,
	playerType,
	audioPlayer,
	ytPlayer,
	playerStatus,
	getYtItems,
	onPlayNext,
}: UseSongPlayerProps): UseSongPlayerReturn {
	const songLoaderRef = useRef<{ cancel: () => void } | null>(null);
	const allowedRetries = useRef(0);

	const playerPause = (): void => {
		if (playerType === 'audio') {
			audioPlayer.element.pause();
		} else {
			ytPlayer.pauseVideo();
		}
	};

	const playerPlay = (): void => {
		if (playerType === 'audio') {
			audioPlayer.element.play();
		} else {
			ytPlayer.playVideo();
		}
	};

	const loadSongByVideoIdDebounced = useCallback(
		debounce(500, (videoId: string, title: string = '') => {
			console.log('%cPlayer:', 'background-color: yellow', videoId, '|', title);
			if (playerType === 'audio') {
				audioPlayer.loadAudioByVideoId(videoId);
			} else {
				ytPlayer.loadVideoById(videoId);
			}
		}),
		[audioPlayer, ytPlayer, playerType]
	);

	const getSongVideoId = async (
		songItem: SongItem,
		fromYT: boolean,
		index: number
	): Promise<string> => {
		const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);

		if (videoIdMatch && !fromYT) return videoIdMatch[1];

		const ytItems = await getYtItems(songItem.title);
		if (ytItems.length > index) return ytItems[index].videoId;
		else
			throw Error(
				`Asked for ${index + 1} item on the list, but got only ${ytItems.length} items.`
			);
	};

	const playSong = async (fromYT = false, ytIndex = 0): Promise<void> => {
		songLoaderRef.current?.cancel();
		const songItem = songs[currentlyPlaying];
		if (songItem) {
			try {
				const videoId = await new Promise<string>((resolve, reject) => {
					songLoaderRef.current = {
						cancel() {
							songLoaderRef.current = null;
							reject(new CancelledActionError());
						},
					};
					getSongVideoId(songItem, fromYT, ytIndex).then(resolve).catch(reject);
				});
				loadSongByVideoIdDebounced(videoId, songItem.title);
			} catch (error) {
				if (!(error instanceof CancelledActionError)) {
					console.warn(
						`Failed to get video id for the song: ${songItem.title}. Error: ${error.message}`
					);
					loadSongByVideoIdDebounced('fakeVideoId'); // workaround for retrying mechanism // TODO: verify if needed for audio player
				}
			}
		}
	};

	const handleSongClick = (songIndex: number): void => {
		if (songIndex === currentlyPlaying) {
			switch (playerStatus) {
				case PlayerStatus.LOADED:
					playerPause();
					break;
				case PlayerStatus.PAUSED:
				case PlayerStatus.ENDED:
					playerPlay();
					break;
				case PlayerStatus.FAILED:
					playSong(true);
					break;
			}
		} else {
			playerPause();
		}
	};

	const getIconForCurrentSong = (): IconProp => {
		switch (playerStatus) {
			case PlayerStatus.PAUSED:
				return faPauseCircle;
			case PlayerStatus.ENDED:
				return faPlayCircle;
			case PlayerStatus.FAILED:
				return faExclamationCircle;
			case PlayerStatus.LOADING:
			case PlayerStatus.LOADED:
			default:
				return faCompactDisc; // TODO: should be spinning
		}
	};

	// Handle player's status change
	useEffect(() => {
		switch (playerStatus) {
			case PlayerStatus.FAILED:
				if (allowedRetries.current > 0) {
					if (allowedRetries.current === 1) playSong(true, 1);
					else playSong(true);

					allowedRetries.current--;
				}
				break;
			case PlayerStatus.ENDED:
				onPlayNext();
				break;
			case PlayerStatus.LOADING:
				if (playerType === 'audio') {
					audioPlayer.element.play(); // autoplay after loading starts
				}
				break;
		}
	}, [playerStatus]);

	// Reset retries when currentlyPlaying changes
	useEffect(() => {
		allowedRetries.current = 3;
	}, [currentlyPlaying]);

	return {
		playSong,
		handleSongClick,
		getIconForCurrentSong,
	};
}
