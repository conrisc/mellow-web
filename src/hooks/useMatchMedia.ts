import { useEffect, useState } from 'react';

export function useMatchMedia(mediaQuery) {
	const [isMatching, setIsMatching] = useState(true);

	useEffect(() => {
		const watcher = window.matchMedia(mediaQuery);
		setIsMatching(watcher.matches);

        const listener = (event) => {
			setIsMatching(event.matches);
		}
		watcher.addEventListener('change', listener);

		return () => {
			watcher.removeEventListener('change', listener);
		};
	}, [mediaQuery]);

    return isMatching;
}
