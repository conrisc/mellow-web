import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

function DeviceListModalX(props) {
    const onlineDevices = props.onlineDevices;
    const [ playersStatus, setPlayersStatus ] = useState({});


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
        setPlayersStatus({...playerStatus, [playerStatus.origin]: playerState });
    }

    return (
        <div id="device-list-modal" className="modal">
            <div className="modal-content">
                <h4>Device list</h4>
                <ul>
                    {onlineDevices.map((device) => <li key={device.name}>
                        <label>
                            <input
                                name=""
                                type="checkbox"
                                checked={device.isChecked}
                                onChange={(e) => props.toggleCheck(e, device)}
                            />
                            <span className={ device.isMe ? 'green-text' : ''}>{device.userAgent.parsed} [{device.name}]</span>
                        </label>
                        <p>
                            {playersStatus[device.name] ? playersStatus[device.name].title : 'N/A'}
                        </p>
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
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export const DeviceListModal = connect(mapStateToProps, mapDispatchToProps)(DeviceListModalX);
