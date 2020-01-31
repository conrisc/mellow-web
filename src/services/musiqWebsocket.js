
import { WsConnection } from 'Services/wsConnection';

export const musiqWebsocket = function () {
    let wsConnection = null;

    function getInstance() {
        if (!wsConnection) {
            wsConnection = new WsConnection(true, 10000);
        }
        
        return wsConnection;
    }

    return {
        getInstance
    }
}();