import React, { useRef, useEffect, useState } from 'react';

const hideClass = 'transform-right-100';

let w = 0;

export function BottomPanel(props) {
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const playerContainerRef = useRef();
    const controlPanelRef = useRef();
    const playerLoader = props.playerLoader;

    useEffect(() => {
        const timeUpdater = setInterval(() => {
            playerLoader.then(player => {
                const currentTime = player.getCurrentTime && player.getCurrentTime() || 0;
                const floorTime = Math.floor(currentTime);
                setTime(floorTime);
            })
        }, 200);

        playerLoader.then((player) => {
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
            playerLoader.then(player => {
                const floorDuration = Math.floor(player.getDuration() || 0)
                setDuration(floorDuration);
                setIsPaused(false);
            });
        } else {
            setIsPaused(true);
        }
    }

    function handleTimeChange(event) {
        const value = event.target.value;
        playerLoader.then(player => {
            player.seekTo(value);
        })
    }

    function playVideo() {
        playerLoader.then(player => {
            player.playVideo();
        })
    }

    function pauseVideo() {
        playerLoader.then(player => {
            player.pauseVideo();
        })
    }

    function formatSeconds(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = ('0' + seconds % 60).slice(-2);
        return `${min}:${sec}`;
    }

    return (
        <div className="">
            <button className="player-btn btn btn-small pos-fixed z-depth-3" onClick={togglePanel}>PLAYER</button>
            <div ref={playerContainerRef} className={"yt-player-container smooth-transform " + hideClass} >
                <div id="yt-player"></div>
            </div>
            <div ref={controlPanelRef} className="control-panel row blue-grey darken-3 white-text">
                <div className="col">
                    <button className="btn btn-simple" onClick={playVideo}>
                        <i className="fas fa-play"></i>
                    </button>
                    <button className="btn btn-simple" onClick={pauseVideo}>
                        <i className="fas fa-pause"></i>
                    </button>
                </div>
                <div className="col s1">
                    <h6>{formatSeconds(time)}</h6>
                </div>
                <div className="col s7">
                    <form action="#">
                        <p className="range-field">
                            <input type="range" min="0" max={duration} value={time} onChange={handleTimeChange}/>
                        </p>
                    </form>
                </div>
                <div className="col s1">
                    <h6>{formatSeconds(duration)}</h6>
                </div>
            </div>
        </div>
    );
}
