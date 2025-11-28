import { WsConnection } from 'Services/wsConnection';
import { WSDataType, WSConnectionOptions } from 'Types/websocket.types';

interface ExtendedWsConnection extends WsConnection {
	sendDataToTargets: (type: WSDataType, data?: any) => void;
	setSelectedDevices: (devices: string[]) => void;
}

export const musiqWebsocket = (function () {
	let wsConnection: ExtendedWsConnection | null = null;
	let selectedDevices: string[] = [];

	function getInstance(options: WSConnectionOptions = {}): ExtendedWsConnection {
		const { setOnline = () => {}, setOffline = () => {} } = options;

		if (!wsConnection) {
			const baseConnection = new WsConnection(true, 10000);
			wsConnection = baseConnection as ExtendedWsConnection;

			wsConnection.sendDataToTargets = (type: WSDataType, data?: any) => {
				const dataWithTargets = {
					...data,
					targets: selectedDevices,
				};
				wsConnection!.sendData(type, dataWithTargets);
			};

			wsConnection.setSelectedDevices = (devices: string[]) => {
				selectedDevices = devices;
			};

			const onlineStatusListener = {
				open: () => {
					setOnline();
				},
				close: () => {
					setOffline();
				},
				error: () => {
					setOffline();
				},
			};
			wsConnection.addListeners(onlineStatusListener);
		}

		return wsConnection;
	}

	return {
		getInstance,
	};
})();
