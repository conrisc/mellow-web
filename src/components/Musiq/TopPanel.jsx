import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { DeviceListModal } from './DeviceListModal.jsx';

function TopPanelX(props) {
    const webSocket = musiqWebsocket.getInstance();
    const sendDataDebounced = debounce(800, (t, d) => webSocket.sendData(t, d));
    const panelRef = useRef();

    function play() {
        webSocket.sendData(dataTypes.PLAY, { targets: getSelectedDevicesNames() });
    }

    function pause() {
        webSocket.sendData(dataTypes.PAUSE, { targets: getSelectedDevicesNames() });
    }

    function setVolume(event) {
        const volume = event.target.value;
        const s = getSelectedDevicesNames();
        console.log('sending to: ', s);
        sendDataDebounced(dataTypes.SET_VOLUME, { volume, targets: s });
    }

    function getSelectedDevicesNames() {
        return props.selectedDevices
            .filter(device => device.isChecked)
            .map(device => device.name);
    }

    return (
        <div ref={panelRef} className="top-panel smooth-transform transform-top-100 white z-depth-1 z-depth-2-sm center-align">
            <DeviceListModal />
            <div className="row">
                <div className="col">
                    <button className={"btn btn-small green" + (props.isOnline ? ' disabled' : '')} onClick={() => webSocket.open()}>Connect</button>
                </div>
                <div className="col">
                    <button className="btn btn-small" onClick={play}>play</button>
                </div>
                <div className="col">
                    <button className="btn btn-small" onClick={pause}>pause</button>
                </div>
                <div className="col s12 m5 l3">
                        <form action="#">
                        <p className="range-field">
                            <input type="range" min="0" max="100" defaultValue={100}
                                onChange={setVolume}
                            />
                        </p>
                    </form>
                </div>
                <button data-target="device-list-modal" className="btn btn-small modal-trigger">
                    Devices
                </button>
                <Link to='/' className="btn btn-small">Go back</Link>
            </div>
            <button className="remote-btn btn btn-small hide-on-large-only pos-absolute cyan lighten-1" onClick={() => panelRef.current.classList.toggle('transform-top-100')}>Remote</button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isOnline: state.isOnline,
        selectedDevices: state.devices.selected
    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
}

export const TopPanel = connect(mapStateToProps, mapDispatchToProps)(TopPanelX);
