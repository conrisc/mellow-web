import React, { useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';
import { Row, Col, Button, Slider } from 'antd';
import { Link } from 'react-router-dom';

import { WS_DATA_TYPES } from 'Types/websocket.types';
import { useWebSocket } from 'Contexts/WebSocketContext';
import { DeviceListController } from './DeviceListController';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward, faPause, faPlay, faServer } from '@fortawesome/free-solid-svg-icons';

export function TopPanel() {
	const { isOnline, connect, sendDataToTargets } = useWebSocket();
	const sendDataDebounced = useRef(
		debounce(800, (t, d) => sendDataToTargets(t, d))
	).current;
	const panelRef = useRef<HTMLDivElement>(null);
	const [isDeviceListVisible, setIsDeviceListVisible] = useState(false);

	function play() {
		sendDataToTargets(WS_DATA_TYPES.PLAY);
	}

	function pause() {
		sendDataToTargets(WS_DATA_TYPES.PAUSE);
	}

	function playPrevious() {
		sendDataToTargets(WS_DATA_TYPES.PREV_SONG);
	}

	function playNext() {
		sendDataToTargets(WS_DATA_TYPES.NEXT_SONG);
	}

	function setVolume(volume: number) {
		sendDataDebounced(WS_DATA_TYPES.SET_VOLUME, { volume });
	}

	return (
		<div
			ref={panelRef}
			className="top-panel smooth-transform transform-top-100 white z-depth-1 z-depth-2-sm"
		>
			<DeviceListController
				isOpen={isDeviceListVisible}
				closeModal={() => setIsDeviceListVisible(false)}
			/>
			<Row gutter={[16, 8]} justify="center" style={{ marginLeft: 0, marginRight: 0 }}>
				<Col>
					<Button type="text" disabled={isOnline} onClick={connect}>
						Connect
					</Button>
				</Col>
				<Col>
					<Button onClick={play} icon={<FontAwesomeIcon icon={faPlay} />} />
				</Col>
				<Col>
					<Button onClick={pause} icon={<FontAwesomeIcon icon={faPause} />} />
				</Col>
				<Col xs={24} lg={3}>
					<Slider defaultValue={100} onChange={setVolume} />
				</Col>
				<Col>
					<Button onClick={playPrevious} icon={<FontAwesomeIcon icon={faBackward} />} />
				</Col>
				<Col>
					<Button onClick={playNext} icon={<FontAwesomeIcon icon={faForward} />} />
				</Col>
				<Col>
					<Button type="ghost" onClick={() => setIsDeviceListVisible(true)} icon={<FontAwesomeIcon icon={faServer} />} />
				</Col>
				<Col>
					<Link to="/">Go back</Link>
				</Col>
			</Row>
			<Button
				type="primary"
				className="remote-btn hide-on-lg pos-absolute lighten-1"
				onClick={() => panelRef.current?.classList.toggle('transform-top-100')}
			>
				Remote
			</Button>
		</div>
	);
}
