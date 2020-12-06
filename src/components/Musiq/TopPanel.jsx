import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';
import { Row, Col, Button, Slider } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { DeviceListController } from './DeviceListController';

function TopPanelX(props) {
    const webSocket = musiqWebsocket.getInstance();
    const sendDataDebounced = debounce(800, (t, d) => webSocket.sendDataToTargets(t, d));
    const panelRef = useRef();
    const [isDeviceListVisible, setIsDeviceListVisible] = useState(false);


    function play() {
        webSocket.sendDataToTargets(dataTypes.PLAY);
    }

    function pause() {
        webSocket.sendDataToTargets(dataTypes.PAUSE);
    }

    function playPrevious() {
        webSocket.sendDataToTargets(dataTypes.PREV_SONG);
    }

    function playNext() {
        webSocket.sendDataToTargets(dataTypes.NEXT_SONG);
    }

    function setVolume(volume) {
        sendDataDebounced(dataTypes.SET_VOLUME, { volume });
    }

    return (
        <div ref={panelRef} className="top-panel smooth-transform transform-top-100 white z-depth-1 z-depth-2-sm center-align">
            <DeviceListController isVisible={isDeviceListVisible} closeModal={() => setIsDeviceListVisible(false)} />
            <Row gutter={16}>
                <Col>
                    <Button type="primary" disabled={props.isOnline ? true : false} onClick={() => webSocket.open()}>Connect</Button>
                </Col>
                <Col>
                    <Button onClick={play}>Play</Button>
                </Col>
                <Col>
                    <Button onClick={pause}>Pause</Button>
                </Col>
                <Col span={2}>
                    <Slider defaultValue={100} onChange={setVolume} />
                </Col>
                <Col>
                    <Button onClick={playPrevious}>Previous</Button>
                </Col>
                <Col>
                    <Button onClick={playNext}>Next</Button>
                </Col>
                <Col>
                    <Button onClick={() => setIsDeviceListVisible(true)}>
                        Devices
                    </Button>
                </Col>
                <Button type="link" href='/'>Go Back</Button>
            </Row>
            <Button type="primary" className="remote-btn d-none-lg pos-absolute lighten-1" onClick={() => panelRef.current.classList.toggle('transform-top-100')}>Remote</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isOnline: state.isOnline
    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
}

export const TopPanel = connect(mapStateToProps, mapDispatchToProps)(TopPanelX);
