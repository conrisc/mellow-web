/**
 * Player status enum matching YouTube IFrame API states
 * Extended with custom states for audio player
 */
export enum PlayerStatus {
	UNSTARTED = -1,
	ENDED = 0,
	LOADED = 1,
	PAUSED = 2,
	LOADING = 3,
	FAILED = -2,
}

/**
 * Video data returned by players
 */
export interface VideoData {
	videoId: string;
	title: string;
	author?: string;
	duration?: number;
}

/**
 * YouTube Player instance interface
 */
export interface YTPlayer {
	loadVideoById: (videoId: string) => void;
	playVideo: () => void;
	pauseVideo: () => void;
	setVolume: (volume: number) => void;
	getPlayerState: () => number;
	getVideoData: () => VideoData;
}

/**
 * Audio Player instance interface
 */
export interface AudioPlayer {
	element: HTMLAudioElement;
	loadAudioByVideoId: (videoId: string) => Promise<void>;
	getVideoData: () => VideoData | null;
}

/**
 * Player type discriminator
 */
export type PlayerType = 'audio' | 'yt';

/**
 * Player context state
 */
export interface PlayerState {
	ytPlayer: YTPlayer | null;
	audioPlayer: AudioPlayer | null;
	playerType: PlayerType;
}
