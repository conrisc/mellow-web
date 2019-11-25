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
        if (this.pingerId) this.close();

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('WebSocket Client Connected', this.ws.readyState);
            this.clearAutoReconnect();

            this.sendData(dataTypes.JOIN);
            this.initHeartbeat();
        };
        this.ws.onclose = (message) => {
            console.warn('OnClose: ', message);
            if (this.autoReconnect && this.reconnectId === null)
                this.initAutoReconnectDebounced(listeners);
            this.close();
        };
        this.ws.onerror = (message) => {
            console.error('OnError: ', message);
            if (this.autoReconnect && this.reconnectId === null)
                this.initAutoReconnectDebounced(listeners);
            this.close();
        };

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

    close() {
        this.stopHeartbeat();
        this.ws.close()
        console.log('Websocket connection has been closed');
    }

    assignListeners(listeners) {
        for (let listenerName in listeners) {
            const callback = this.ws[listenerName];
            this.ws[listenerName] = callback ?
                (msg) => {
                    callback(msg);
                    listeners[listenerName](msg);
                }
                : listeners[listenerName];
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
