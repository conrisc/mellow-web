import React, { useRef } from 'react';

const hideClass = 'transform-right-100';

export function BottomPanel(props) {
    const playerContainerRef = useRef();

    return (
        <div className="">
            <button className="player-btn btn btn-small pos-fixed z-depth-3" onClick={() => { playerContainerRef.current.classList.toggle(hideClass)} }>PLAYER</button>
            <div ref={playerContainerRef} className={"yt-player-container smooth-transform " + hideClass} >
                <div id="yt-player"></div>
            </div>
        </div>
    );
}
