import { WsConnection } from 'Services/wsConnection';
import { dataTypes } from 'Constants/wsConstants';

export const musiqWebsocket = function () {
    let wsConnection = null;
    let selectedDevices = [];

    function getInstance({
        setOnline = () => {},
        setOffline = () => {}
    } = {}) {
        if (!wsConnection) {
            wsConnection = new WsConnection(true, 10000);

            wsConnection.sendDataToTargets = (type, data) => {
                const dataWithTargets = {
                    ...data,
                    targets: selectedDevices
                };
                wsConnection.sendData(type, dataWithTargets);
            };

            wsConnection.setSelectedDevices = (devices) => {
                selectedDevices = devices;
            };

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
