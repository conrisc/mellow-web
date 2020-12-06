import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Slider } from 'antd';

function BottomPanelX(props) {
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(true);

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

    function handleTimeChange(value) {
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
        <div>
            <Row className="control-panel blue-grey darken-3 white-text" justify="space-between">
                <Col>
                    <Button ghost={true} onClick={playVideo}>
                        <i className="fas fa-play"></i>
                    </Button>
                    <Button ghost={true} onClick={pauseVideo}>
                        <i className="fas fa-pause"></i>
                    </Button>
                </Col>
                <Col className="timer" span={2}>
                    <span>{formatSeconds(time)}</span>
                </Col>
                <Col span={14}>
                    {/* Use handleTimeChange debounce */}
                    <Slider min={0} max={duration} value={time} onChange={handleTimeChange} tipFormatter={formatSeconds} />
                </Col>
                <Col className="timer" span={2}>
                    <span>{formatSeconds(duration)}</span>
                </Col>
            </Row>
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
