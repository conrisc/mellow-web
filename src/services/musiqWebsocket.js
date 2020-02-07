import { WsConnection } from 'Services/wsConnection';
import { dataTypes } from 'Constants/wsConstants';

export const musiqWebsocket = function () {
    let wsConnection = null;

    function getInstance({
        setOnline = () => {},
        setOffline = () => {},
        handleDevicesInfo = () => {}
    } = {}) {
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
                },
                message: (message) => {
                    const dataFromServer = JSON.parse(message.data);
                    if (dataFromServer.type === dataTypes.CLIENTS_INFO) {
                        handleDevicesInfo(dataFromServer.clients);
                    }
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
