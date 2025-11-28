import { useEffect } from 'react';
import { notification } from 'antd';
import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

interface UseWebSocketControlsProps {
	onPlayNext: () => void;
	onPlayPrevious: () => void;
}

export function useWebSocketControls({ onPlayNext, onPlayPrevious }: UseWebSocketControlsProps) {
	useEffect(() => {
		const webSocket = musiqWebsocket.getInstance();

		const wsListeners = {
			message: (message: MessageEvent) => {
				const dataFromServer = JSON.parse(message.data);
				switch (dataFromServer.type) {
					case dataTypes.NEXT_SONG:
						onPlayNext();
						pushNotification('Play next song');
						break;
					case dataTypes.PREV_SONG:
						onPlayPrevious();
						pushNotification('Play previous song');
						break;
				}
			},
		};

		webSocket.addListeners(wsListeners);

		// Cleanup is not needed as the singleton persists
	}, [onPlayNext, onPlayPrevious]);
}

function pushNotification(text: string): void {
	notification.open({
		message: 'Song list notification',
		description: text,
	});
}
