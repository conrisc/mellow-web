import React, { useRef } from 'react';
import { connect } from 'react-redux';

const hideClass = 'transform-right-100';

function YtPlayerX(props) {
    const playerContainerRef = useRef();
    const playerRef = useRef();

    loadYT.then(YT => {
        props.setYtPlayer(
            new YT.Player(playerRef.current, {
                height: 360,
                width: 640
            })
        );
    });

    return (
        <div ref={playerContainerRef} className={"yt-player-container smooth-transform "} >
            <div ref={playerRef} id="yt-player" />
        </div>
    );
}

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        setYtPlayer: ytPlayer => dispatch({ type: 'SET_YT_PLAYER', ytPlayer })
    };
}

export const YtPlayer = connect(mapStateToProps, mapDispatchToProps)(YtPlayerX);
