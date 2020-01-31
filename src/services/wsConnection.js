import { dataTypes } from 'Constants/wsConstants';

const url = 'wss://what-appy-server.herokuapp.com';
const interval = 1000;

export class WsConnection {
    constructor(autoReconnect = false, reconnectInterval = 30000) {
        this.reconnectId = null;
        this.autoReconnect = autoReconnect;
        this.reconnectInterval = reconnectInterval;
        this.listenersCollection = [];
    }

    open() {
        this.ws = new WebSocket(url);
        this.ws.addEventListener('open', () => {
            console.log('WebSocket Client Connected', this.ws.readyState);
            if (this.reconnectId) this._clearAutoReconnect();

            this.sendData(dataTypes.JOIN);
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
        })

        this._assignListenersCollection();
    }

    close() {
        this._clearListenersCollection();
        this.listenersCollection = [];
        this.autoReconnect = false;
        this._clearAutoReconnect();
        this.ws.close()
        console.log('Websocket connection has been closed');
    }

    _assignListeners(listeners) {
        for (const listenerName in listeners) {
            this.ws.addEventListener(listenerName, listeners[listenerName]);
        }
    }

    _clearListeners(listeners) {
        for (const listenerName in listeners) {
            this.ws.removeEventListener(listenerName, listeners[listenerName]);
        }
    }

    _assignListenersCollection() {
        for (const listeners of this.listenersCollection) {
            this._assignListeners(listeners);
        }
    }

    _clearListenersCollection() {
        for (const listeners of this.listenersCollection) {
            this._clearListeners(listeners);
        }
    }

    addListeners(customListeners) {
        this.listenersCollection.push(customListeners);
        if (this.ws) this._assignListeners(customListeners);
    }

    removeListeners(customListeners) {
        this.listenersCollection = this.listenersCollection.filter(listeners => listeners !== customListeners);
        if (this.ws) this._clearListeners(customListeners);
    }

    _initHeartbeat() {
        this.sendData(dataTypes.PING);
        this.pingerId = setInterval(() => {
            this.sendData(dataTypes.PING);
        }, 20000);
    }

    _stopHeartbeat() {
        clearInterval(this.pingerId);
        this.pingerId = null;
    }

    _initAutoReconnect() {
        if (this.autoReconnect && this.reconnectId === null) {
            console.log('%cWebSocket autoreconnect has been initialized', 'color: green');
            this.reconnectId = setInterval(() => {
                console.log('WebSocket Auto reconnecting...');
                this.open();
            }, this.reconnectInterval);
        }
    }

    _clearAutoReconnect() {
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
