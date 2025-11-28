import { useEffect } from 'react';

interface UseInfiniteScrollProps {
	isActive: boolean;
	songsCount: number;
	scrollPosition: number;
	scrollHeight: number;
	onLoadMore: () => void;
	threshold?: number;
}

export function useInfiniteScroll({
	isActive,
	songsCount,
	scrollPosition,
	scrollHeight,
	onLoadMore,
	threshold = 100,
}: UseInfiniteScrollProps) {
	useEffect(() => {
		if (isActive && songsCount > 0 && scrollHeight - scrollPosition < threshold) {
			onLoadMore();
		}
	}, [scrollPosition, isActive, songsCount, scrollHeight, threshold, onLoadMore]);
}
