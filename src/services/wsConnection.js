import { debounce } from 'throttle-debounce';
import { dataTypes } from 'Constants/wsConstants';

const url = 'wss://what-appy-server.herokuapp.com';
const interval = 1000;

export class WSConnection {
    constructor(listeners = {}, autoReconnect = false, reconnectInterval = 30000) {
        this.sendDataDebounced = debounce(interval, this.sendData);
        this.reconnectId = null;
        this.autoReconnect = autoReconnect;
        this.reconnectInterval = reconnectInterval;
        this.initAutoReconnectDebounced = debounce(1000, () => this.initAutoReconnect());
        this.listeners = listeners;
    }

    open() {
        this.ws = new WebSocket(url);
        this.ws.addEventListener('open', () => {
            console.log('WebSocket Client Connected', this.ws.readyState);
            this.clearAutoReconnect();

            this.sendData(dataTypes.JOIN);
            this.initHeartbeat();
        });
        this.ws.addEventListener('close', (message) => {
            console.warn('OnClose: ', message);
            this.initAutoReconnectDebounced();
            this.stopHeartbeat();
        });
        this.ws.addEventListener('error', (message) => {
            console.error('OnError: ', message);
            this.initAutoReconnectDebounced();
            this.stopHeartbeat();
        });

        this.assignListeners();
    }

    close() {
        this.clearListeners();
        this.listeners = {};
        this.autoReconnect = false;
        this.clearAutoReconnect();
        this.ws.close()
        console.log('Websocket connection has been closed');
    }

    assignListeners() {
        for (let listenerName in this.listeners) {
            this.ws.addEventListener(listenerName, this.listeners[listenerName]);
        }
    }

    clearListeners() {
        for(const listenerName in this.listeners) {
            this.ws.removeEventListener(listenerName, this.listeners[listenerName]);
        }
    }

    initHeartbeat() {
        this.sendData(dataTypes.PING);
        this.pingerId = setInterval(() => {
            this.sendData(dataTypes.PING);
        }, 20000);
    }

    stopHeartbeat() {
        clearInterval(this.pingerId);
        this.pingerId = null;
    }

    initAutoReconnect() {
        if (this.autoReconnect && this.reconnectId === null) {
            console.log('%cWebSocket autoreconnect has been initialized', 'color: green');
            this.reconnectId = setInterval(() => {
                console.log('WebSocket Auto reconnecting...');
                this.open();
            }, this.reconnectInterval);
        }
    }

    clearAutoReconnect() {
        clearInterval(this.reconnectId);
        this.reconnectId = null;
        console.log('%cWebSocket autoreconnect has been disabled', 'color: green');
    }

    sendData(type, data = {}) {
        const wsData = {
            type,
            ...data
        }
        console.log('WS <sendData>', wsData);
        this.ws.send(JSON.stringify(wsData))
    }
}
