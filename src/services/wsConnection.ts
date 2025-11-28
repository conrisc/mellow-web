import { WS_DATA_TYPES, WSDataType, WSListeners } from 'Types/websocket.types';
import { MELLOV_WEBSOCKET_URI } from 'Constants/environment';

export class WsConnection {
	private reconnectId: NodeJS.Timeout | null = null;
	private autoReconnect: boolean;
	private reconnectInterval: number;
	private listenersCollection: WSListeners[] = [];
	private pingerId: NodeJS.Timeout | null = null;
	public name: string = '';
	public ws: WebSocket | null = null;

	constructor(autoReconnect: boolean = false, reconnectInterval: number = 30000) {
		this.autoReconnect = autoReconnect;
		this.reconnectInterval = reconnectInterval;
	}

	open(): void {
		if (this.ws && this.ws.readyState < 2) {
			console.warn('WebSocket connection is already established');
			return;
		}
		this.ws = new WebSocket(MELLOV_WEBSOCKET_URI);
		this.ws.addEventListener('open', () => {
			console.log('WebSocket Client Connected', this.ws?.readyState);
			if (this.reconnectId) this._clearAutoReconnect();

			this.sendData(WS_DATA_TYPES.JOIN);
			this._initHeartbeat();
		});
		this.ws.addEventListener('close', (message) => {
			console.warn('OnClose: ', message);
			this._initAutoReconnect();
			this._stopHeartbeat();
		});
		this.ws.addEventListener('error', (message) => {
			console.error('OnError: ', message);
			this._initAutoReconnect();
			this._stopHeartbeat();
		});
		this.ws.addEventListener('message', (message) => {
			const dataFromServer = JSON.parse(message.data);
			console.log('WS <onmessage>: ', dataFromServer);
			if (dataFromServer.type === WS_DATA_TYPES.JOIN) {
				this.name = dataFromServer.name;
			}
		});

		this._assignListenersCollection();
	}

	close(): void {
		this._clearListenersCollection();
		this.listenersCollection = [];
		this.autoReconnect = false;
		this._clearAutoReconnect();
		this.ws?.close();
		console.log('Websocket connection has been closed');
	}

	private _assignListeners(listeners: WSListeners): void {
		if (!this.ws) return;

		for (const listenerName in listeners) {
			const eventType = listenerName as keyof WSListeners;
			const listener = listeners[eventType];
			if (listener) {
				this.ws.addEventListener(listenerName, listener as EventListener);
			}
		}
	}

	private _clearListeners(listeners: WSListeners): void {
		if (!this.ws) return;

		for (const listenerName in listeners) {
			const eventType = listenerName as keyof WSListeners;
			const listener = listeners[eventType];
			if (listener) {
				this.ws.removeEventListener(listenerName, listener as EventListener);
			}
		}
	}

	private _assignListenersCollection(): void {
		for (const listeners of this.listenersCollection) {
			this._assignListeners(listeners);
		}
	}

	private _clearListenersCollection(): void {
		for (const listeners of this.listenersCollection) {
			this._clearListeners(listeners);
		}
	}

	addListeners(customListeners: WSListeners): void {
		this.listenersCollection.push(customListeners);
		if (this.ws) this._assignListeners(customListeners);
	}

	removeListeners(customListeners: WSListeners): void {
		this.listenersCollection = this.listenersCollection.filter(
			(listeners) => listeners !== customListeners
		);
		if (this.ws) this._clearListeners(customListeners);
	}

	private _initHeartbeat(): void {
		this.pingerId = setInterval(() => {
			this.sendData(WS_DATA_TYPES.PING);
		}, 20000);
	}

	private _stopHeartbeat(): void {
		if (this.pingerId) {
			clearInterval(this.pingerId);
			this.pingerId = null;
		}
	}

	private _initAutoReconnect(): void {
		if (this.autoReconnect && this.reconnectId === null) {
			console.log('%cWebSocket autoreconnect has been initialized', 'color: green');
			this.reconnectId = setInterval(() => {
				console.log('WebSocket Auto reconnecting...');
				this.open();
			}, this.reconnectInterval);
		}
	}

	private _clearAutoReconnect(): void {
		if (this.reconnectId) {
			clearInterval(this.reconnectId);
			this.reconnectId = null;
			console.log('%cWebSocket autoreconnect has been disabled', 'color: green');
		}
	}

	sendData(type: WSDataType, data: any = {}): void {
		if (!this.ws) return;

		const wsData = {
			type,
			...data,
		};
		console.log('WS <sendData>', wsData);
		this.ws.send(JSON.stringify(wsData));
	}
}
