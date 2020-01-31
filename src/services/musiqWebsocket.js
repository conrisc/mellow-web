
import { WsConnection } from 'Services/wsConnection';

export const musiqWebsocket = function () {
    let wsConnection = null;

    function getInstance({ setOnline = () => {}, setOffline = () => {} } = {}) {
        if (!wsConnection) {
            wsConnection = new WsConnection(true, 10000);
            const onlineStatusListener = {
                open: () => {
                    setOnline();
                },
                close: (message) => {
                    setOffline();
                },
                error: (message) => {
                    setOffline();
                }
            }
            wsConnection.addListeners(onlineStatusListener);
        }
        
        return wsConnection;
    }

    return {
        getInstance
    }
}();