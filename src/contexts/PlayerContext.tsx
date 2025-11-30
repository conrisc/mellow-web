import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { YTPlayer, AudioPlayer, PlayerType, UnifiedPlayer } from 'Types/player.types';
import { useYtPlayerStatus } from '../hooks/useYtPlayerStatus';
import { useAudioPlayerStatus } from '../hooks/useAudioPlayerStatus';

/**
 * Creates a unified player interface for AudioPlayer
 */
function createAudioPlayerAdapter(player: AudioPlayer | null): UnifiedPlayer | null {
	if (!player) return null;

	return {
		load: (videoId: string) => player.loadAudioByVideoId(videoId),
		play: () => player.element.play(),
		pause: () => player.element.pause(),
		getVideoData: () => player.getVideoData(),
		getCurrentTime: () => player.element.currentTime,
		getDuration: () => player.element.duration || 0,
		seekTo: (seconds: number) => {
			player.element.currentTime = seconds;
		},
		setVolume: (volume: number) => {
			player.element.volume = volume / 100; // HTML audio uses 0-1
		},
		getType: () => 'audio' as PlayerType,
	};
}

/**
 * Creates a unified player interface for YTPlayer
 */
function createYtPlayerAdapter(player: YTPlayer | null): UnifiedPlayer | null {
	if (!player) return null;

	return {
		load: (videoId: string) => player.loadVideoById(videoId),
		play: () => player.playVideo(),
		pause: () => player.pauseVideo(),
		getVideoData: () => player.getVideoData(),
		getCurrentTime: () => player.getCurrentTime(),
		getDuration: () => player.getDuration(),
		seekTo: (seconds: number) => player.seekTo(seconds),
		setVolume: (volume: number) => player.setVolume(volume),
		getType: () => 'yt' as PlayerType,
	};
}

interface PlayerContextValue {
	ytPlayer: YTPlayer | null;
	audioPlayer: AudioPlayer | null;
	playerType: PlayerType;
	player: UnifiedPlayer | null; // Unified player interface
	setYtPlayer: (player: YTPlayer | null) => void;
	setAudioPlayer: (player: AudioPlayer | null) => void;
	setPlayerType: (type: PlayerType) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

interface PlayerProviderProps {
	children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
	const [ytPlayer, setYtPlayer] = useState<YTPlayer | null>(null);
	const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
	const [playerType, setPlayerType] = useState<PlayerType>('audio');

	// Create unified player adapter based on current player type
	const player = useMemo<UnifiedPlayer | null>(() => {
		if (playerType === 'audio') {
			return createAudioPlayerAdapter(audioPlayer);
		} else {
			return createYtPlayerAdapter(ytPlayer);
		}
	}, [playerType, audioPlayer, ytPlayer]);

	const value: PlayerContextValue = {
		ytPlayer,
		audioPlayer,
		playerType,
		player,
		setYtPlayer,
		setAudioPlayer,
		setPlayerType,
	};

	return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
	const context = useContext(PlayerContext);
	if (context === undefined) {
		throw new Error('usePlayer must be used within a PlayerProvider');
	}
	return context;
}

/**
 * Hook that provides unified player status monitoring
 * Automatically uses the correct status hook based on player type
 */
export function usePlayerStatus() {
	const { audioPlayer, ytPlayer, playerType } = usePlayer();

	const audioStatus = useAudioPlayerStatus(audioPlayer);
	const ytStatus = useYtPlayerStatus(ytPlayer);

	// Return status for the currently active player
	return playerType === 'audio' ? audioStatus : ytStatus;
}
