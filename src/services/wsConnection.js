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
        this.initAutoReconnectDebounced = debounce(1000, this.initAutoReconnect);
    }

    open(listeners = {}) {
        if (this.pingerId) this.close();

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            this.clearAutoReconnect();
            console.log('WebSocket Client Connected', this.ws.readyState);
            const data = {
                type: dataTypes.JOIN,
            }
            this.ws.send(JSON.stringify(data));
            this.pingerId = setInterval(() => {
                this.sendData(dataTypes.PING);
            }, 10000);
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

    close() {
        clearInterval(this.pingerId);
        this.pingerId = null;
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

    sendData(type, data = {}) {
        const wsData = {
            type,
            ...data
        }
        console.log('WS <sendData>', wsData);
        this.ws.send(JSON.stringify(wsData))
    }

    initAutoReconnect(listeners) {
        console.log('WebSocket autoreconnect has been initialized');
        this.reconnectId = setInterval(() => {
            console.log('WebSocket Auto reconnecting...');
            this.open(listeners);
        }, this.reconnectInterval);
    }

    clearAutoReconnect() {
        clearInterval(this.reconnectId);
        this.reconnectId = null;
        console.log('WebSocket autoreconnect has been disabled');
    }
}
