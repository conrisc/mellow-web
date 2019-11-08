import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

export function TopPanel(props) {
    const panelRef = useRef();

    return (
        <div ref={panelRef} className="top-panel smooth-transform transform-top-100 white pos-fixed-sm z-depth-1 z-depth-2-sm center-align">
            <div className="row">
                {/* <div className="col s2">
                    <Link to='/' className="btn">Go back</Link>
                </div> */}
                <div className="row">
                    <div className="col m2">
                        <button className="btn-floating btn-large" onClick={props.play}>play</button>
                    </div>
                    <div className="col m2">
                        <button className="btn-floating btn-large" onClick={props.pause}>pause</button>
                    </div>
                    <div className="col s12 m8 l6">
                            <form action="#">
                            <p className="range-field">
                                <input type="range" min="0" max="100" value={props.volume}
                                    onChange={e => {
                                        const v = e.target.value;
                                        props.setVolume(v);
                                        props.setVolume2Debounced.current(v);
                                    }}
                                />
                            </p>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col s4">
                        <input type="number" value={props.skip} onChange={e => { props.setSkip(Number(e.target.value)) }}></input>
                    </div>
                    <div className="col s4">
                        <input type="number" value={props.limit} onChange={e => { props.setLimit(Number(e.target.value)) }}></input>
                    </div>
                    <div className="col s4 center-align">
                        <button className="btn btn-small" onClick={props.getSongs}>Reload</button>
                    </div>
                </div>
            </div>
            <button className="btn btn-small hide-on-large-only transform-bottom-110 cyan lighten-1" onClick={() => panelRef.current.classList.toggle('transform-top-100')}>Remote</button>
        </div>
    );
}
