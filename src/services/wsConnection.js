import { debounce } from 'throttle-debounce';
import { dataTypes } from 'Constants/wsConstants';

const url = 'wss://what-appy-server.herokuapp.com';
const interval = 1000;

export class WSConnection {
    constructor(autoReconnect = false, reconnectInterval = 30000) {
        this.sendDataDebounced = debounce(interval, this.sendData);
        this.reconnectId = null;
        this.autoReconnect = autoReconnect;
        this.reconnectInterval = reconnectInterval;
        this.initAutoReconnectDebounced = debounce(1000, (l) => this.initAutoReconnect(l));
    }

    open(listeners = {}) {
        this.ws = new WebSocket(url);

        this.ws.addEventListener('open', () => {
            console.log('WebSocket Client Connected', this.ws.readyState);
            this.clearAutoReconnect();

            this.sendData(dataTypes.JOIN);
            this.initHeartbeat();
        });
        this.ws.addEventListener('close', (message) => {
            console.warn('OnClose: ', message);
            if (this.autoReconnect && this.reconnectId === null)
                this.initAutoReconnectDebounced(listeners);
            this.stopHeartbeat();
        });
        this.ws.addEventListener('error', (message) => {
            console.error('OnError: ', message);
            if (this.autoReconnect && this.reconnectId === null)
                this.initAutoReconnectDebounced(listeners);
            this.stopHeartbeat();
        });

        this.assignListeners(listeners);
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

    close(listeners = {}) {
        this.clearListeners(listeners);
        this.ws.close()
        console.log('Websocket connection has been closed');
    }

    assignListeners(listeners) {
        for (let listenerName in listeners) {
            this.ws.addEventListener(listenerName, listeners[listenerName]);
        }
    }

    clearListeners(listeners) {
        for(const listenerName in listeners) {
            this.ws.removeEventListener(listenerName, listeners[listenerName]);
        }
    }

    initAutoReconnect(listeners) {
        console.log('%cWebSocket autoreconnect has been initialized', 'color: green');
        this.reconnectId = setInterval(() => {
            console.log('WebSocket Auto reconnecting...');
            this.open(listeners);
        }, this.reconnectInterval);
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
