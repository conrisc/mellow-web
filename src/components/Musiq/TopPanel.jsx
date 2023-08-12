import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';
import { Row, Col, Button, Slider } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { DeviceListController } from './DeviceListController';
import { Link } from 'react-router-dom';

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
        <div ref={panelRef} className="top-panel smooth-transform transform-top-100 white z-depth-1 z-depth-2-sm">
            <DeviceListController isOpen={isDeviceListVisible} closeModal={() => setIsDeviceListVisible(false)} />
            <Row gutter={[16, 8]} justify="center">
                <Col>
                    <Button type="text" disabled={props.isOnline ? true : false} onClick={() => webSocket.open()}>Connect</Button>
                </Col>
                <Col>
                    <Button onClick={play}>
                        <i className="fas fa-play"></i>
                    </Button>
                </Col>
                <Col>
                    <Button onClick={pause}>
                        <i className="fas fa-pause"></i>
                    </Button>
                </Col>
                <Col xs={24} lg={3}>
                    <Slider defaultValue={100} onChange={setVolume} />
                </Col>
                <Col>
                    <Button onClick={playPrevious}>
                        <i className="fas fa-backward"></i>
                    </Button>
                </Col>
                <Col>
                    <Button onClick={playNext}>
                        <i className="fas fa-forward"></i>
                    </Button>
                </Col>
                <Col>
                    <Button type="ghost" onClick={() => setIsDeviceListVisible(true)}>
                        <i className="fas fa-server"></i>
                    </Button>
                </Col>
                <Col>
                    {/* <Button type="text" href='/'>Go Back</Button> */}
                    <Link to="/">Go back</Link>
                </Col>
            </Row>
            <Button type="primary" className="remote-btn hide-on-lg pos-absolute lighten-1" onClick={() => panelRef.current.classList.toggle('transform-top-100')}>Remote</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isOnline: state.isOnline
    }
};

const mapDispatchToProps = dispatch => ({});

export const TopPanel = connect(mapStateToProps, mapDispatchToProps)(TopPanelX);
