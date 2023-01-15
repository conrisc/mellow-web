import React, { useEffect, useState } from 'react';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { DeviceListModal } from './DeviceListModal';

export function DeviceListController(props) {
    const [onlineDevices, setOnlineDevices] = useState([]);

    useEffect(() => {
        const webSocket = musiqWebsocket.getInstance();
        const wsListener = {
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.type === dataTypes.CLIENTS_INFO) {
                    handleDevicesInfo(dataFromServer.clients);
                }
            }
        }
        webSocket.addListeners(wsListener);

        return () => {
            webSocket.removeListeners(wsListener);
        };
    }, []);

    function handleDevicesInfo(devices) {
        const webSocket = musiqWebsocket.getInstance()
        const newDevices = devices;
        newDevices.forEach(device => {
            device.isChecked = !!(onlineDevices.find(dev => dev.name === device.name) || {}).isChecked;
            device.isMe = device.name === webSocket.name;
        });
        setOnlineDevices(newDevices);
        webSocket.setSelectedDevices(newDevices.filter(device => device.isChecked).map(device => device.name));
    }

    function toggleCheck(event, toggledDevice) {
        const modifiedDevice = {
            ...toggledDevice,
            isChecked: event.target.checked
        };

        setOnlineDevices(onlineDevices.map(device => {
            return device === toggledDevice ?
                modifiedDevice :
                device
        }));
    }

    return (
        <DeviceListModal
            isOpen={props.isOpen}
            closeModal={props.closeModal}
            onlineDevices={onlineDevices}
            toggleCheck={toggleCheck}
        />
    );
}
