import React, { createContext, useContext, useState, ReactNode } from 'react';
import { YTPlayer, AudioPlayer, PlayerType } from 'Types/player.types';

interface PlayerContextValue {
	ytPlayer: YTPlayer | null;
	audioPlayer: AudioPlayer | null;
	playerType: PlayerType;
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

	const value: PlayerContextValue = {
		ytPlayer,
		audioPlayer,
		playerType,
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
