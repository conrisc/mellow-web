import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import { dataTypes } from 'Constants/wsConstants';

export function TopPanel(props) {
    const panelRef = useRef();
    const ws = props.ws;

    function play() {
        ws.sendData(dataTypes.PLAY);
    }

    function pause() {
        ws.sendData(dataTypes.PAUSE);
    }

    function setVolume(volume) {
        ws.sendDataDebounced(dataTypes.SET_VOLUME, { volume });
    }

    return (
        <div ref={panelRef} className="top-panel smooth-transform transform-top-100 white pos-fixed-sm z-depth-1 z-depth-2-sm center-align">
            <div className="row">
                {/* <div className="col s2">
                    <Link to='/' className="btn">Go back</Link>
                </div> */}
                <div className="row">
                    <div className="col m2">
                        <button className={"btn green" + (props.isConnected ? ' disabled' : '')} onClick={props.connect}>Connect</button>
                    </div>
                    <div className="col m2">
                        <button className="btn" onClick={play}>play</button>
                    </div>
                    <div className="col m2">
                        <button className="btn" onClick={pause}>pause</button>
                    </div>
                    <div className="col s12 m6 l6">
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
            </div>
            <button className="btn btn-small hide-on-large-only transform-bottom-110 cyan lighten-1" onClick={() => panelRef.current.classList.toggle('transform-top-100')}>Remote</button>
        </div>
    );
}
