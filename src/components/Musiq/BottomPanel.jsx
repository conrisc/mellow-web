import React, { useRef, useEffect, useState } from 'react';

const hideClass = 'transform-right-100';

let w = 0;

export function BottomPanel(props) {
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerContainerRef = useRef();
    const controlPanelRef = useRef();

    useEffect(() => {
        const timeUpdater = setInterval(() => {
            loadYT
                .then(player => {
                    const currentTime = player.getCurrentTime && player.getCurrentTime() || 0;
                    const floorTime = Math.floor(currentTime);
                    setTime(floorTime);
                })
        }, 200);

        loadYT
            .then((player) => {
                player.addEventListener('onStateChange', updateVideoDuration);
            })

        return () => {
            clearInterval(timeUpdater);
        }
    })

    function togglePanel() {
        playerContainerRef.current.classList.toggle(hideClass);
        controlPanelRef.current.classList.toggle(hideClass);
    }

    function updateVideoDuration(state) {
        if (state.data === 1) {
            loadYT
                .then(player => {
                    const floorDuration = Math.floor(player.getDuration() || 0)
                    setDuration(floorDuration);
                });
        }
    }

    function handleTimeChange(event) {
        const value = event.target.value;
        loadYT
            .then(player => {
                player.seekTo(value);
            })
    }

    return (
        <div className="">
            <button className="player-btn btn btn-small pos-fixed z-depth-3" onClick={togglePanel}>PLAYER</button>
            <div ref={playerContainerRef} className={"yt-player-container smooth-transform " + hideClass} >
                <div id="yt-player"></div>
            </div>
            <div ref={controlPanelRef} className="control-panel row">
                <div className="col s2">
                    {time}
                </div>
                <div className="col s8">
                    <form action="#">
                        <p className="range-field">
                            <input type="range" min="0" max={duration} value={time} onChange={handleTimeChange}/>
                        </p>
                    </form>
                </div>
                <div className="col s2">
                    {duration}
                </div>
            </div>
        </div>
    );
}
