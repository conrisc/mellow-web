/**
 * Video data returned by players
 */
export interface VideoData {
	videoId: string;
	title: string;
}

export interface YTPlayer {
	loadVideoById: (videoId: string) => void;
	playVideo: () => void;
	pauseVideo: () => void;
	setVolume: (volume: number) => void;
	getPlayerState: () => number;
	getVideoData: () => VideoData;
	getCurrentTime: () => number;
	getDuration: () => number;
	seekTo: (seconds: number) => void;
	addEventListener: (event: string, listener: (state: any) => void) => void;
}

export interface AudioPlayer {
	element: HTMLAudioElement;
	loadAudioByVideoId: (videoId: string) => Promise<void>;
	getVideoData: () => VideoData | null;
}

export type PlayerType = 'audio' | 'yt';

export enum PlayerStatus {
	INITIALIZED,
	UNSTARTED,
	FAILED,
	ENDED,
	LOADED,
	PAUSED,
	LOADING
}

/**
 * Unified player interface that wraps both AudioPlayer and YtPlayer
 * Components use this instead of dealing with player-specific APIs
 */
export interface UnifiedPlayer {
	load: (videoId: string) => void | Promise<void>;
	play: () => void | Promise<void>;
	pause: () => void;
	getVideoData: () => VideoData | null;
	getCurrentTime: () => number;
	getDuration: () => number;
	seekTo: (seconds: number) => void;
	setVolume: (volume: number) => void;
	getType: () => PlayerType;
}
