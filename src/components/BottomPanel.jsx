import React, { useRef } from 'react';

export function BottomPanel(props) {
    const panelRef = useRef();

    return (
        <div ref={panelRef} className="bottom-panel smooth-transform transform-bottom-390px">
            <button className="btn btn-sm z-depth-3" onClick={() => { panelRef.current.classList.toggle('transform-bottom-390px')} }>SHOW/HIDE</button>
            <div id="player"></div>
        </div>
    );
}
