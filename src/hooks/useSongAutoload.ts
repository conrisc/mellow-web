import { useEffect } from 'react';

interface UseSongAutoloadProps {
	currentlyPlaying: number | null;
	playSong: () => Promise<void>;
}

export function useSongAutoload({ currentlyPlaying, playSong }: UseSongAutoloadProps) {
	useEffect(() => {
		if (currentlyPlaying !== null) {
			playSong();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentlyPlaying]);
}
