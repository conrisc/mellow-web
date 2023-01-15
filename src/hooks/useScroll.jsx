import React, { useState, useEffect } from 'react';
import { debounce } from 'throttle-debounce';

export function useScroll() {
	const [scrollPosition, setScrollPosition] = useState(0);
	const [scrollHeight, setScrollHeight] = useState(Infinity);

	useEffect(() => {
		const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
		setScrollHeight(scrollHeight);
		setScrollPosition(scrollTop + clientHeight);
	}, []);

    useEffect(() => {
        const onScroll = () => {
            const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
			setScrollHeight(scrollHeight);
            setScrollPosition(scrollTop + clientHeight);
        }
        const onScrollDebounced = debounce(300, onScroll);
        document.addEventListener('scroll', onScrollDebounced);

        return () => {
            document.removeEventListener('scroll', onScrollDebounced);
        }
    }, []);

	return {
		scrollPosition,
		scrollHeight
	}
}
