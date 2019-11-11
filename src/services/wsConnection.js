import { debounce } from 'throttle-debounce';
import { dataTypes } from '../constants/wsConstants';

const url = 'wss://what-appy-server.herokuapp.com';
const interval = 1000;

export class WSConnection {
    constructor() {
        this.sendDataDebounced = debounce(interval, this.sendData);
    }

    open(listeners = {}) {
        if (this.pingerId) this.close();

        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
            console.log('WebSocket Client Connected', this.ws.readyState);
            const data = {
                type: dataTypes.JOIN,
            }
            this.ws.send(JSON.stringify(data));
        };
        this.assignListeners(listeners);
        this.pingerId = setInterval(() => {
            this.sendData(dataTypes.PING);
        }, 30000);
    }

    close() {
        clearInterval(this.pingerId);
        this.pingerId = null;
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
}
