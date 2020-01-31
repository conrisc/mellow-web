import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

function TopPanelX(props) {
    const webSocket = musiqWebsocket.getInstance();
    const sendDataDebounced = debounce(800, (t, d) => websocket.sendData(t, d));
    const panelRef = useRef();

    function play() {
        webSocket.sendData(dataTypes.PLAY);
    }

    function pause() {
        webSocket.sendData(dataTypes.PAUSE);
    }

    function setVolume(volume) {
        sendDataDebounced(dataTypes.SET_VOLUME, { volume });
    }

    return (
        <div ref={panelRef} className="top-panel smooth-transform transform-top-100 white pos-fixed-sm z-depth-1 z-depth-2-sm center-align">
            <div className="row">
                <Link to='/' className="btn">Go back</Link>
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
                            <input type="range" min="0" max="100" value={props.volume}
                                onChange={e => {
                                    const v = e.target.value;
                                    props.setVolume(v);
                                    setVolume(v);
                                }}
                            />
                        </p>
                    </form>
                </div>
            </div>
            <button className="remote-btn btn btn-small hide-on-large-only pos-absolute cyan lighten-1" onClick={() => panelRef.current.classList.toggle('transform-top-100')}>Remote</button>
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
