import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';
import { YTList } from './YTList';

const API_KEY = 'AIzaSyBS6s9-nwxzxCfS0Uazv1-tedGwWwo9CZs';

gapi.load("client");
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => { console.log("GAPI client loaded for API"); },
            (err) => { console.error("Error loading GAPI client for API", err); });
}

setTimeout(() => {
    loadClient();
}, 1000);

const loadYT = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT)
})


const dataTypes = {
    NEW_MESSAGE: 'new_message',
    JOIN: 'join',
    PLAY: 'play',
    PAUSE: 'pause',
    SET_VOLUME: 'set_volume',
    LOAD_VIDEO: 'load_video',
    PING: 'ping'
}

export function Musiq(props) {
    const [ ytItems, setYtItems ] = useState([]);
    const [ songs, setSongs ] = useState([]);
    const [ volume, setVolume ] = useState(100);
    const setVolume2Debounced = useRef();
    const handleSearchChange = useRef();
    const player = useRef();
    const ws = useRef();

    useEffect(() => {
        setVolume2Debounced.current = debounce(1000, setVolume2);
        handleSearchChange.current = debounce(1000, searchVideo);
        getSongs();

        ws.current = new WebSocket('wss://what-appy-server.herokuapp.com');

        ws.current.onopen = () => {
            console.log('WebSocket Client Connected');
            const data = {
                type: dataTypes.JOIN,
            }
            ws.current.send(JSON.stringify(data));
        };
        ws.current.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log('WS <onmessage>: ', dataFromServer);
            switch (dataFromServer.type) {
                case dataTypes.NEW_MESSAGE:
                    console.log('WS <NEW_MESSAGE>: ', dataFromServer);
                    break;
                case dataTypes.PLAY:
                    player.current.playVideo();
                    break;
                case dataTypes.PAUSE:
                    player.current.pauseVideo();
                    break;
                case dataTypes.SET_VOLUME:
                    setVolume(dataFromServer.volume);
                    player.current.setVolume(dataFromServer.volume);
                    break;
                case dataTypes.LOAD_VIDEO:
                    player.current.loadVideoById(dataFromServer.videoId)
                    player.current.playVideo();
                    break;
            }
        };

        loadYT.then((YT) => {
            player.current = new YT.Player('player', {
                height: 390,
                width: 640,
                videoId: 'LlY90lG_Fuw',
                events: {
                },
                playerVars: { 'origin': 'https://what-appy.herokuapp.com/' }
            })
        })

        let pingPong = setInterval(() => {
            sendPing();
        }, 40000)
        return () => {
            clearInterval(pingPong);
        }
    }, []);

    function getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: 0,
            limit: 10
        };

        api.searchSong(opts)
            .then(data => {
                setSongs(data);
            }, error => {
                console.error(error);
            });
    }

    function searchVideo(text) {
        if (!text || text === '') {
            console.log('searchVideo: input is empty');
            return;
        }

        return gapi.client.youtube.search.list({
            "part": "snippet",
            "maxResults": 5,
            "type": "video",
            "q": text
        }).then((response) => {
                setYtItems(response.result ? response.result.items : []);
            },
            (err) => { console.error("Execute error", err); });
    }

    function sendPing() {
         const data = {
            type: dataTypes.PING,
        };
        ws.current.send(JSON.stringify(data));
    }

    function sendMessage(text) {
         const data = {
            type: dataTypes.NEW_MESSAGE,
            message: 'some msg',
        };
        ws.current.send(JSON.stringify(data));
    }

    function play() {
         const data = {
            type: dataTypes.PLAY
        };
        ws.current.send(JSON.stringify(data));
    }
    function pause() {
         const data = {
            type: dataTypes.PAUSE
        };
        ws.current.send(JSON.stringify(data));
    }
    function setVolume2(vol) {
         const data = {
            type: dataTypes.SET_VOLUME,
            volume: vol
        };
        ws.current.send(JSON.stringify(data));
    }


    function loadVideo(videoId) {
        const data = {
            type: dataTypes.LOAD_VIDEO,
            videoId
        }
        ws.current.send(JSON.stringify(data));
    }

    return (
        <div>
            <div className="row">
                <div className="col s2">
                    <Link to='/' className="btn">Go back</Link>
                </div>
                <div className="col s2">
                    <button className="btn" onClick={play}>play</button>
                </div>
                <div className="col s2">
                    <button className="btn" onClick={pause}>pause</button>
                </div>
                <div className="col s2">
                      <form action="#">
                        <p className="range-field">
                            <input type="range" min="0" max="100" value={volume}
                                onChange={e => {
                                    const v = e.target.value;
                                    setVolume(v);
                                    setVolume2Debounced.current(v);
                                }}
                            />
                        </p>
                    </form>
                </div>
            </div>
            <input type="text" onChange={e => {const t = e.target.value; handleSearchChange.current(t)}}></input>
            <div className="row">
                <div className="col s6">
                    <TrackList songs={songs} findSong={searchVideo} />
                </div>
                <div className="col s6">
                    <YTList items={ytItems} loadVideo={loadVideo} />
                </div>
                <div id="player"></div>
            </div>
        </div>
    );
}
