import React, { useRef } from 'react';

export function BottomPanel(props) {
    const panelRef = useRef();

    return (
        <div ref={panelRef} className="bottom-panel smooth-transform transform-bottom-360px">
            <button className="player-btn btn btn-small pos-absolute z-depth-3" onClick={() => { panelRef.current.classList.toggle('transform-bottom-360px')} }>PLAYER</button>
            <div id="player"></div>
        </div>
    );
}
