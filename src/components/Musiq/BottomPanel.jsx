import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';

const hideClass = 'transform-right-100';

function BottomPanelX(props) {
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const controlPanelRef = useRef();

    useEffect(() => {
        const timeUpdater = setInterval(() => {
            const currentTime = props.ytPlayer.getCurrentTime && props.ytPlayer.getCurrentTime() || 0;
            const floorTime = Math.floor(currentTime);
            setTime(floorTime);
        }, 200);

        props.ytPlayer.addEventListener('onStateChange', updateVideoDuration);

        return () => {
            clearInterval(timeUpdater);
        }
    }, [])

    function togglePanel() {
        controlPanelRef.current.classList.toggle(hideClass);
    }

    function updateVideoDuration(state) {
        if (state.data === 1) {
            const floorDuration = Math.floor(props.ytPlayer.getDuration() || 0)
            setDuration(floorDuration);
            setIsPaused(false);
        } else if (state.data === -1 || state.data === 5) {
            setDuration(0);
            setIsPaused(true);
        }
        else {
            setIsPaused(true);
        }
    }

    function handleTimeChange(event) {
        const value = event.target.value;
        props.ytPlayer.seekTo(value);
    }

    function playVideo() {
        props.ytPlayer.playVideo();
    }

    function pauseVideo() {
        props.ytPlayer.pauseVideo();
    }

    function formatSeconds(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = ('0' + seconds % 60).slice(-2);
        return `${min}:${sec}`;
    }

    return (
        <div className="">
            <button className="player-btn btn btn-small pos-fixed z-depth-3" onClick={togglePanel}>PLAYER</button>
            <div ref={controlPanelRef} className="control-panel row blue-grey darken-3 white-text">
                <div className="col">
                    <button className="btn btn-simple" onClick={playVideo}>
                        <i className="fas fa-play"></i>
                    </button>
                    <button className="btn btn-simple" onClick={pauseVideo}>
                        <i className="fas fa-pause"></i>
                    </button>
                </div>
                <div className="col s1 timer">
                    <span>{formatSeconds(time)}</span>
                </div>
                <div className="col s7">
                    <form action="#">
                        <p className="range-field">
                            <input type="range" min="0" max={duration} value={time} onChange={handleTimeChange}/>
                        </p>
                    </form>
                </div>
                <div className="col s1 timer">
                    <span>{formatSeconds(duration)}</span>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export const BottomPanel = connect(mapStateToProps, mapDispatchToProps)(BottomPanelX);
