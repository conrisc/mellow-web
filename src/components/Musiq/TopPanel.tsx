import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';
import { Row, Col, Button, Slider } from 'antd';
import { Link } from 'react-router-dom';

import { WS_DATA_TYPES } from 'Types/websocket.types';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { DeviceListController } from './DeviceListController';

interface TopPanelProps {
	isOnline: boolean;
}

function TopPanelX({ isOnline }: TopPanelProps) {
	const webSocket = musiqWebsocket.getInstance();
	const sendDataDebounced = debounce(800, (t, d) => webSocket.sendDataToTargets(t, d));
	const panelRef = useRef<HTMLDivElement>(null);
	const [isDeviceListVisible, setIsDeviceListVisible] = useState(false);

	function play() {
		webSocket.sendDataToTargets(WS_DATA_TYPES.PLAY);
	}

	function pause() {
		webSocket.sendDataToTargets(WS_DATA_TYPES.PAUSE);
	}

	function playPrevious() {
		webSocket.sendDataToTargets(WS_DATA_TYPES.PREV_SONG);
	}

	function playNext() {
		webSocket.sendDataToTargets(WS_DATA_TYPES.NEXT_SONG);
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
					<Button type="text" disabled={isOnline} onClick={() => webSocket.open()}>
						Connect
					</Button>
				</Col>
				<Col>
					<Button onClick={play}>
						<i className="fas fa-play"></i>
					</Button>
				</Col>
				<Col>
					<Button onClick={pause}>
						<i className="fas fa-pause"></i>
					</Button>
				</Col>
				<Col xs={24} lg={3}>
					<Slider defaultValue={100} onChange={setVolume} />
				</Col>
				<Col>
					<Button onClick={playPrevious}>
						<i className="fas fa-backward"></i>
					</Button>
				</Col>
				<Col>
					<Button onClick={playNext}>
						<i className="fas fa-forward"></i>
					</Button>
				</Col>
				<Col>
					<Button type="ghost" onClick={() => setIsDeviceListVisible(true)}>
						<i className="fas fa-server"></i>
					</Button>
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

const mapStateToProps = (state: any) => {
	return {
		isOnline: state.isOnline,
	};
};

const mapDispatchToProps = () => ({});

export const TopPanel = connect(mapStateToProps, mapDispatchToProps)(TopPanelX);
