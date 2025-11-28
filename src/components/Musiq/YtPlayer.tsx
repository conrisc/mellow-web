import React, { useRef, useEffect } from 'react';
import { notification } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { usePlayer } from 'Contexts/PlayerContext';
import { YTPlayer } from 'Types/player.types';

declare const YT: any;
declare const loadYT: Promise<typeof YT>;

export function YtPlayer() {
	const { ytPlayer, setYtPlayer } = usePlayer();
	const ytPlayerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		loadYT.then((YT) => {
			if (ytPlayerRef.current) {
				setYtPlayer(
					new YT.Player(ytPlayerRef.current, {
						playerVars: { controls: 2, modestbranding: 1 },
					})
				);
			}
		});
	}, [setYtPlayer]);

	useEffect(() => {
		if (!ytPlayer) return;

		const webSocket = musiqWebsocket.getInstance();
		const wsListeners = {
			message: (message: MessageEvent) => {
				const dataFromServer = JSON.parse(message.data);
				switch (dataFromServer.type) {
					case dataTypes.NEW_MESSAGE:
						console.log('WS <NEW_MESSAGE>: ', dataFromServer);
						break;
					case dataTypes.PLAY:
						ytPlayer.playVideo();
						pushNotification('Playing video');
						break;
					case dataTypes.PAUSE:
						ytPlayer.pauseVideo();
						pushNotification('Pausing video');
						break;
					case dataTypes.SET_VOLUME:
						ytPlayer.setVolume(dataFromServer.volume);
						pushNotification(`Setting volume to ${dataFromServer.volume}`);
						break;
					case dataTypes.LOAD_VIDEO:
						ytPlayer.loadVideoById(dataFromServer.videoId);
						pushNotification(`Loading video: ${dataFromServer.videoId}`);
						break;
				}
			},
		};
		webSocket.addListeners(wsListeners);

		return () => {
			webSocket.removeListeners(wsListeners);
		};
	}, [ytPlayer]);

	// useEffect(() => {
	//     if (!ytPlayer) return;

	//     const webSocket = musiqWebsocket.getInstance();
	//     const sendDataDebounced = debounce(1200, webSocket.sendData.bind(webSocket));
	//     ytPlayer.addEventListener('onStateChange', state => {
	//         const playerState = {
	//             state: state.data,
	//             videoId: ytPlayer.getVideoData().video_id || '',
	//             title: ytPlayer.getVideoData().title || '',
	//             time: Math.floor(ytPlayer.getCurrentTime()) || 0
	//         };
	//         sendDataDebounced(dataTypes.PLAYER_STATE, playerState);
	//     });
	// }, [ytPlayer]);

	function pushNotification(text: string): void {
		notification.open({
			message: 'Player notification',
			description: text,
		});
	}

	return (
		<div className={'yt-player-container'}>
			<div ref={ytPlayerRef} className="w-100" style={{ height: 300 }} />
		</div>
	);
}
