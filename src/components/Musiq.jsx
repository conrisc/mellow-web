import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';
import { YTList } from './YTList';
import { TopPanel } from './TopPanel';
import { BottomPanel } from './BottomPanel';

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

const fakeYTData = [
    {
        id: { videoId: 'someId' },
        snippet: {
            title: 'Some title',
            thumbnails: {
                default: {
                    url: 'https://youtube.com'
                }
            }
        }
    },
    {
        id: { videoId: 'someId' },
        snippet: {
            title: 'Some other title',
            thumbnails: {
                default: {
                    url: 'https://youtube.com'
                }
            }
        }
    }
];

export function Musiq(props) {
    const [ ytItems, setYtItems ] = useState(fakeYTData);
    const [ songs, setSongs ] = useState([]);
    const [ volume, setVolume ] = useState(100);
    const setVolume2Debounced = useRef();
    const handleSearchChange = useRef();
    const onScrollDebounced = useRef();
    const player = useRef(null);
    const ws = useRef();
    const YTListRef = useRef();
    const songsLoader = useRef();

    const [ skip, setSkip ] = useState(0);
    const [ limit, setLimit ] = useState(30);

    useEffect(() => {
        onScrollDebounced.current = debounce(1000, onScroll)
        window.addEventListener('scroll', onScrollDebounced.current);

        return () => {
            window.removeEventListener('scroll', onScrollDebounced.current);
        }
    }, [skip, limit, songs]);

    useEffect(() => {
        setVolume2Debounced.current = debounce(1000, setVolume2);
        handleSearchChange.current = debounce(1000, searchVideo);
        songsLoader.current = getSongs();

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
                height: 360,
                width: 640
            })
        })

        let pingPong = setInterval(() => {
            sendPing();
        }, 40000)
        return () => {
            clearInterval(pingPong);
        }
    }, []);

    function onScroll() {
        if (window.scrollY + window.innerHeight > document.body.scrollHeight - 200) {
            songsLoader.current = songsLoader.current
                .then(updateSongs);
        }
    }

    function getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: skip,
            limit: limit
        };

        return api.searchSong(opts)
            .then(data => {
                setSongs(data);
            }, error => {
                console.error(error);
            });
    }

    function updateSongs () {
        const api = new DevelopersApi();

        const opts = {
            skip: skip+limit,
            limit
        };

        return api.searchSong(opts)
            .then(data => {
                setSongs([...songs, ...data]);
                setSkip(skip + data.length)
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
            <TopPanel 
                play={play}
                pause={pause}
                volume={volume}
                setVolume={setVolume}
                setVolume2Debounced={setVolume2Debounced}
                skip={skip}
                setSkip={setSkip}
                limit={limit}
                setLimit={setLimit}
                getSongs={getSongs}
            />
            {/* <input type="text" onChange={e => {const t = e.target.value; handleSearchChange.current(t)}}></input> */}
            <div className="row pos-relative">
                <div className="col s12 l6">
                    <TrackList songs={songs} findSong={searchVideo} loadVideo={loadVideo} />
                </div>
                <div ref={YTListRef} className="col s11 l6 smooth-transform transform-right-100 pos-fixed-sm right-0 grey darken-3 white-text z-depth-2-sm mt-4-sm">
                    <button className="btn btn-small hide-on-large-only pos-absolute transform-left-110 red" onClick={() => YTListRef.current.classList.toggle('transform-right-100')}>YT</button>
                    <YTList items={ytItems} loadVideo={loadVideo} />
                </div>
            </div>
            <BottomPanel />
        </div>
    );
}
