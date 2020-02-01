import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

const hideClass = 'transform-right-100';

function YtPlayerX(props) {
    const playerContainerRef = useRef();
    const playerRef = useRef();

    useEffect(() => {
        loadYT.then(YT => {
            props.setYtPlayer(
                new YT.Player(playerRef.current, {
                    height: 360,
                    width: 640
                })
            );
        });
    }, []);

    useEffect(() => {
        if (!props.ytPlayer) return;

        const webSocket = musiqWebsocket.getInstance();
        const wsListeners = {
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                switch (dataFromServer.type) {
                    case dataTypes.NEW_MESSAGE:
                        console.log('WS <NEW_MESSAGE>: ', dataFromServer);
                        break;
                    case dataTypes.PLAY:
                        props.ytPlayer.playVideo();
                        props.pushToast('Playing video');
                        break;
                    case dataTypes.PAUSE:
                        props.ytPlayer.pauseVideo();
                        props.pushToast('Pausing video');
                        break;
                    case dataTypes.SET_VOLUME:
                        props.ytPlayer.setVolume(dataFromServer.volume);
                        props.pushToast(`Setting volume to ${dataFromServer.volume}`);
                        break;
                    case dataTypes.LOAD_VIDEO:
                        props.ytPlayer.loadVideoById(dataFromServer.videoId)
                        props.pushToast(`Loading video: ${dataFromServer.videoId}`);
                        break;
                }
            }
        };
        webSocket.addListeners(wsListeners);

        return () => {
            webSocket.removeListeners(wsListeners);
        };
    }, [props.ytPlayer]);

    return (
        <div ref={playerContainerRef} className={"yt-player-container smooth-transform " + hideClass} >
            <div ref={playerRef} className="w-100" />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        pushToast: (toast) => dispatch({ type: 'PUSH_TOAST', toast }),
        setYtPlayer: ytPlayer => dispatch({ type: 'SET_YT_PLAYER', ytPlayer })
    };
}

export const YtPlayer = connect(mapStateToProps, mapDispatchToProps)(YtPlayerX);
