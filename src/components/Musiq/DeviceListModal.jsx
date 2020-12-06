import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, List, Checkbox } from 'antd';

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
        <Modal
            title="Device list"
            visible={props.isVisible}
            onCancel={props.closeModal}
            footer={[
                <Button onClick={props.closeModal}>
                    Close
                </Button>
            ]}
        >
            <List
                rowKey="name"
                dataSource={onlineDevices}
                renderItem={(device) => (
                    <List.Item>
                        <Checkbox
                            checked={device.isChecked}
                            onChange={(e) => props.toggleCheck(e, device)}
                        >
                            <span className={ device.isMe ? 'green-text' : ''}>{device.userAgent.parsed} [{device.name}]</span>
                        </Checkbox>
                        <p>
                            {playersStatus[device.name] ? playersStatus[device.name].title : 'N/A'}
                        </p>
                    </List.Item>
                )}
            />
        </Modal>
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
