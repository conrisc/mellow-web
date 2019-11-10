import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';
import { YTList } from './YTList';
import { TopPanel } from './TopPanel';
import { BottomPanel } from './BottomPanel';
import { Toast } from './Toast';

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

export class Musiq extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ytItems: fakeYTData,
            songs: [],
            volume: 100,
            skip: 0,
            limit: 30,
            toasts: [],
            isConnected: false
        }
        this.player = null;
        this.ws = new WebSocket('wss://what-appy-server.herokuapp.com');
        this.YTListRef = React.createRef();
        this.songsLoader = this.getSongs();
        this.remote = {
            sendPing: () => {
                const data = {
                    type: dataTypes.PING,
                };
                this.ws.send(JSON.stringify(data));
            },
            sendMessage: (text) => {
                const data = {
                    type: dataTypes.NEW_MESSAGE,
                    message: 'some msg',
                };
                this.ws.send(JSON.stringify(data));
            },
            play: () => {
                const data = {
                    type: dataTypes.PLAY
                };
                this.ws.send(JSON.stringify(data));
            },
            pause: () => {
                const data = {
                    type: dataTypes.PAUSE
                };
                this.ws.send(JSON.stringify(data));
            },
            setVolume2: (vol) => {
                const data = {
                    type: dataTypes.SET_VOLUME,
                    volume: vol
                };
                this.ws.send(JSON.stringify(data));
            },
            loadVideo: (videoId) => {
                const data = {
                    type: dataTypes.LOAD_VIDEO,
                    videoId
                }
                this.ws.send(JSON.stringify(data));
            }
        }
        this.handleSearchChange = debounce(1000, this.searchVideo);
        this.setVolume2Debounced = debounce(1000, this.remote.setVolume2);
        this.onScrollDebounced = debounce(1000, this.onScroll)
        this.ping = setInterval(() => {
            this.remote.sendPing();
        }, 40000);
    }

    componentDidMount() {
        window.addEventListener('offline', (e) => { console.log('offline'); });
        window.addEventListener('online', (e) => { console.log('online'); });
        window.addEventListener('scroll', this.onScrollDebounced);

        this.connect();

        loadYT.then((YT) => {
            this.player = new YT.Player('player', {
                height: 360,
                width: 640
            })
        })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollDebounced);
        clearInterval(this.ping);
    }

    connect() {
        this.ws.onopen = () => {
            console.log('WebSocket Client Connected', this.ws.readyState);
            this.setState({ isConnected: true });
            const data = {
                type: dataTypes.JOIN,
            }
            this.ws.send(JSON.stringify(data));
        };
        this.ws.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log('WS <onmessage>: ', dataFromServer);
            switch (dataFromServer.type) {
                case dataTypes.NEW_MESSAGE:
                    console.log('WS <NEW_MESSAGE>: ', dataFromServer);
                    break;
                case dataTypes.PLAY:
                    this.player.playVideo();
                    this.setState({ toasts: 
                        [{
                            date: new Date(),
                            text: 'Playing video'
                        }, ...this.state.toasts] 
                    });
                    break;
                case dataTypes.PAUSE:
                    this.player.pauseVideo();
                    console.log('Pausing', this.state.toasts);
                    this.setState({ toasts: 
                        [{
                            date: new Date(),
                            text: 'Pausing video'
                        }, ...this.state.toasts]
                    });
                    break;
                case dataTypes.SET_VOLUME:
                    setVolume(dataFromServer.volume);
                    this.setState({ volume: dataFromServer.volume });
                    this.setState({ toasts:
                        [{
                            date: new Date(),
                            text: `Setting volume to ${dataFromServer.volume}`
                        }, ...this.state.toasts]
                    });
                    this.player.setVolume(dataFromServer.volume);
                    break;
                case dataTypes.LOAD_VIDEO:
                    this.player.loadVideoById(dataFromServer.videoId)
                    this.player.playVideo();
                    this.setState({ toasts:
                        [{
                            date: new Date(),
                            text: `Loading video: ${dataFromServer.videoId}`
                        }, ...this.state.toasts
                    ]});
                    break;
            }
        };

        this.ws.onclose = (message) => {
            console.warn('OnClose: ', message, this.ws.readyState);
            this.setState({ isConnected: false })
            this.setState({ toasts: 
                [{
                    date: new Date(),
                    text: `WS<onclose>: ${message.type}`
                }, ...this.state.toasts]
            });
        }

        this.ws.onerror = (message) => {
            console.error('OnError: ', message, this.ws.readyState);
            this.setToasts({ toasts:
                [{
                    date: new Date(),
                    text: `WS<onerror>: ${message.type}`
                }, ...this.state.toasts]
            });
        }
    }

    onScroll() {
        if (window.scrollY + window.innerHeight > document.body.scrollHeight - 200) {
            this.songsLoader = this.songsLoader
                .then(this.updateSongs);
        }
    }

    getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip,
            limit: this.state.limit
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: data })
            }, error => {
                this.setState({ toasts:
                    [{
                        date: new Date(),
                        text: 'Cound not get songs'
                    }, ...this.state.toasts]}
                );
                console.error(error);
            });
    }

    updateSongs () {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip + this.state.limit,
            limit: this.state.limit
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: [...this.state.songs, ...data] });
                this.setState({skip: this.state.skip + data.length});
            }, error => {
                setToasts([{
                    date: new Date(),
                    text: 'Cound not update songs'
                }, ...this.state.toasts]);
                console.error(error);
            });
    }

    searchVideo(text) {
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
                this.setState({ytItems: response.result ? response.result.items : []})
            },
            (err) => {
                this.setState({ toasts:
                    [{
                        date: new Date(),
                        text: 'Cound not search youtube videos'
                    }, ...(this.state.toasts)]
                });
                console.error("Execute error", err); 
            });
    }

    setVolume(value) {
        this.setState({ volume: value });
    }

    setSkip(value) {
        this.setState({ skip: value });
    }

    setLimit(value) {
        this.setState({ limit: value });
    }

    setToasts(value) {
        this.setState({ toasts: value });
    }

    render() {
        return (
            <div>
                <Toast data={this.state.toasts} setToasts={(v) => this.setToasts(v)}></Toast>
                <TopPanel 
                    play={() => this.remote.play()}
                    pause={() => this.remote.pause()}
                    volume={this.state.volume}
                    setVolume={(v) => this.setVolume(v)}
                    setVolume2Debounced={() => this.setVolume2Debounced()}
                    skip={this.state.skip}
                    setSkip={(v) => this.setSkip(v)}
                    limit={this.state.limit}
                    setLimit={(v) => this.setLimit(v)}
                    getSongs={(v) => this.getSongs(v)}
                    connect={() => this.connect()}
                    isConnected={this.state.isConnected}
                />
                {/* <input type="text" onChange={e => {const t = e.target.value; this.handleSearchChange(t)}}></input> */}
                <div className="row pos-relative">
                    <div className="col s12 l6">
                        <TrackList songs={this.state.songs} findSong={(t) => this.searchVideo(t)} loadVideo={(id) => this.remote.loadVideo(id)} />
                    </div>
                    <div ref={this.YTListRef} className="col s11 l6 smooth-transform transform-right-100 pos-fixed-sm right-0 grey darken-3 white-text z-depth-2-sm mt-4-sm">
                        <button className="btn btn-small hide-on-large-only pos-absolute transform-left-110 red" onClick={() => this.YTListRef.current.classList.toggle('transform-right-100')}>YT</button>
                        <YTList items={this.state.ytItems} loadVideo={(id) => this.remote.loadVideo(id)} />
                    </div>
                </div>
                <BottomPanel />
            </div>
        );
    }
};
