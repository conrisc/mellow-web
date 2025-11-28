import React, { useEffect } from 'react';

import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';
import { WebSocketProvider } from 'Contexts/WebSocketContext';
import { PlayerProvider } from 'Contexts/PlayerContext';

export function Musiq() {
	useEffect(() => {
		document.querySelector('#manifest-placeholder')?.setAttribute('href', '/manifest-musiq.json');
		// WebSocket connection is now managed by WebSocketContext
		// webSocket.current.open();

		// return () => {
		//     webSocket.current.close();
		// }
	}, []);

	return (
		<PlayerProvider>
			<WebSocketProvider>
				<div>
					<TopPanel />
					<MainView />
					{/* <BottomPanel /> */}
				</div>
			</WebSocketProvider>
		</PlayerProvider>
	);
}
