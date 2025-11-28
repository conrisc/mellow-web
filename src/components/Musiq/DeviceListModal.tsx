import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Checkbox } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

interface Device {
	name: string;
	isChecked: boolean;
	isMe: boolean;
	userAgent: {
		parsed: string;
	};
}

interface PlayerState {
	state: number;
	time: number;
	title: string;
	videoId: string;
}

interface PlayersStatus {
	[deviceName: string]: PlayerState;
}

interface DeviceListModalProps {
	isOpen: boolean;
	closeModal: () => void;
	onlineDevices: Device[];
	toggleCheck: (e: any, device: Device) => void;
}

export function DeviceListModal({ isOpen, closeModal, onlineDevices, toggleCheck }: DeviceListModalProps) {
	const [playersStatus, setPlayersStatus] = useState<PlayersStatus>({});

	useEffect(() => {
		const webSocket = musiqWebsocket.getInstance();
		const playersStatusListener = {
			message: (message: MessageEvent) => {
				const dataFromServer = JSON.parse(message.data);
				if (dataFromServer.type === dataTypes.PLAYER_STATE) {
					handlePlayerState(dataFromServer);
				}
			},
		};
		webSocket.addListeners(playersStatusListener);

		return () => {
			webSocket.removeListeners(playersStatusListener);
		};
	}, []);

	function handlePlayerState(playerStatus: any) {
		const playerState: PlayerState = {
			state: playerStatus.state,
			time: playerStatus.time,
			title: playerStatus.title,
			videoId: playerStatus.videoId,
		};
		setPlayersStatus({ ...playersStatus, [playerStatus.origin]: playerState });
	}

	return (
		<Modal
			title="Device list"
			open={isOpen}
			onCancel={closeModal}
			footer={<Button onClick={closeModal}>Close</Button>}
		>
			<List
				rowKey="name"
				dataSource={onlineDevices}
				renderItem={(device) => (
					<List.Item>
						<Checkbox checked={device.isChecked} onChange={(e) => toggleCheck(e, device)}>
							<span style={device.isMe ? { color: 'green' } : {}}>
								{device.userAgent.parsed} [{device.name}]
							</span>
						</Checkbox>
						<p>{playersStatus[device.name] ? playersStatus[device.name].title : 'N/A'}</p>
					</List.Item>
				)}
			/>
		</Modal>
	);
}
