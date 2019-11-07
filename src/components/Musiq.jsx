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
    VOLUME_UP: 'volume_up',
    VOLUME_DOWN: 'volume_down',
    LOAD_VIDEO: 'load_video'
}

export function Musiq(props) {
    const [ ytItems, setYtItems ] = useState([]);
    const [ songs, setSongs ] = useState([]);
    let player = useRef();
    let ws = useRef();
    let volume = useRef(100);

    useEffect(() => {
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
                case dataTypes.VOLUME_UP:
                    if (volume.current < 100) {
                        volume.current += 5;
                        player.current.setVolume(volume.current);
                    }
                    break;
                case dataTypes.VOLUME_DOWN:
                    if (volume.current > 0) {
                        volume.current -= 5;
                        player.current.setVolume(volume.current);
                    }
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

    const handleSearchChange = debounce(1000, searchVideo);

    function sendMessage() {
         const data = {
            type: dataTypes.NEW_MESSAGE,
            message: 'fajna wiadomosc2',
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
    function up() {
         const data = {
            type: dataTypes.VOLUME_UP
        };
        ws.current.send(JSON.stringify(data));
    }
    function down() {
         const data = {
            type: dataTypes.VOLUME_DOWN
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
                    <button className="btn" onClick={sendMessage}>send</button>
                </div>
                <div className="col s2">
                    <button className="btn" onClick={play}>play</button>
                </div>
                <div className="col s2">
                    <button className="btn" onClick={pause}>pause</button>
                </div>
                <div className="col s2">
                    <button className="btn" onClick={up}>up</button>
                </div>
                <div className="col s2">
                    <button className="btn" onClick={down}>down</button>
                </div>
            </div>
            <input type="text" onChange={e => {const t = e.target.value; handleSearchChange(t)}}></input>
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
