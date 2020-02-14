import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

function DeviceListModalX(props) {
    const selectedDevices = props.devices.selected;
    const [ playersStatus, setPlayersStatus ] = useState({});


    useEffect(() => {
        const newDevices = props.devices.online;
        newDevices.forEach(device => {
            device.isChecked = !!(selectedDevices.find(dev => dev.name === device.name) || {}).isChecked;
        });
        props.setSelectedDevices(newDevices);
    }, [props.devices.online]);

    useEffect(() => {
        const webSocket = musiqWebsocket.getInstance();
        const playersStatusListener = {
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.type === dataTypes.PLAYER_STATE) {
                    handlePlayerState(dataFromServer);
                }
            }
        }
        webSocket.addListeners(playersStatusListener);

        return () => {
            webSocket.removeListeners(playersStatusListener);
        };
    });

    function handlePlayerState(playerStatus) {
        const playerState = {
            state: playerStatus.state,
            time: playerStatus.time,
            title: playerStatus.title,
            vidoeId: playerStatus.vidoeId
        }
        console.log(playersStatus);
        setPlayersStatus({...playerStatus, [playerStatus.origin]: playerState });
    }

    function selectDevice(event, device) {
        device.isChecked = event.target.checked;
        props.setSelectedDevices([...selectedDevices]);
    }

    return (
        <div id="device-list-modal" className="modal">
            <div className="modal-content">
                <h4>Device list</h4>
                <ul>
                    {selectedDevices.map((device) => <li key={device.name}>
                        <label>
                            <input
                                name=""
                                type="checkbox"
                                checked={device.isChecked}
                                onChange={(e) => selectDevice(e, device)}
                            />
                            <span>{device.name}</span>
                        </label>
                        {playersStatus[device.name] ? playersStatus[device.name].title : 'N/A'}
                    </li>)}
                </ul>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        devices: state.devices
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedDevices: (devices) => dispatch({ type: 'SET_SELECTED_DEVICES', devices })
    }
};

export const DeviceListModal = connect(mapStateToProps, mapDispatchToProps)(DeviceListModalX);
