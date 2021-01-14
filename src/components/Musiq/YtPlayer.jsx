import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { debounce } from 'throttle-debounce';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

function YtPlayerX(props) {
    const playerRef = useRef();

    useEffect(() => {
        loadYT.then(YT => {
            props.setYtPlayer(
                new YT.Player(playerRef.current, {
                    playerVars: { controls: 2, modestbranding: 1 }
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
                        pushNotification('Playing video');
                        break;
                    case dataTypes.PAUSE:
                        props.ytPlayer.pauseVideo();
                        pushNotification('Pausing video');
                        break;
                    case dataTypes.SET_VOLUME:
                        props.ytPlayer.setVolume(dataFromServer.volume);
                        pushNotification(`Setting volume to ${dataFromServer.volume}`);
                        break;
                    case dataTypes.LOAD_VIDEO:
                        props.ytPlayer.loadVideoById(dataFromServer.videoId)
                        pushNotification(`Loading video: ${dataFromServer.videoId}`);
                        break;
                }
            }
        };
        webSocket.addListeners(wsListeners);

        return () => {
            webSocket.removeListeners(wsListeners);
        };
    }, [props.ytPlayer]);

    useEffect(() => {
        if (!props.ytPlayer) return;

        const webSocket = musiqWebsocket.getInstance();
        const sendDataDebounced = debounce(1200, webSocket.sendData.bind(webSocket));
        props.ytPlayer.addEventListener('onStateChange', state => {
            const playerState = {
                state: state.data,
                videoId: props.ytPlayer.getVideoData().video_id || '',
                title: props.ytPlayer.getVideoData().title || '',
                time: Math.floor(props.ytPlayer.getCurrentTime()) || 0
            };
            sendDataDebounced(dataTypes.PLAYER_STATE, playerState);
        });
    }, [props.ytPlayer]);

    function pushNotification(text) {
        notification.open({
            message: 'Player notification',
            description: text
        });
    }

    return (
        <div className={"yt-player-container"} >
            <div ref={playerRef} className="w-100" style={{ height: 300 }} />
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
        setYtPlayer: ytPlayer => dispatch({ type: 'SET_YT_PLAYER', ytPlayer })
    };
}

export const YtPlayer = connect(mapStateToProps, mapDispatchToProps)(YtPlayerX);
