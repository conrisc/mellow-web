import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';
import { YTList } from './YTList';
import { TopPanel } from './TopPanel';
import { BottomPanel } from './BottomPanel';
import { Toast } from './Toast';
import { WSConnection } from '../services/wsConnection';
import { dataTypes } from '../constants/wsConstants';

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
        this.YTListRef = React.createRef();
        this.songsLoader = this.getSongs();
        this.handleSearchChange = debounce(1000, () => this.searchVideo());
        this.onScrollDebounced = debounce(1000, () => this.onScroll())
        this.ws = new WSConnection();
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
        this.ws.close();
    }

    connect() {
        const listeners = {
            onopen: () => {
                this.setState({ isConnected: true });
            },
            onmessage: (message) => {
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
            },
            onclose: (message) => {
                console.warn('OnClose: ', message);
                this.setState({ isConnected: false })
                this.setState({ toasts:
                    [{
                        date: new Date(),
                        text: `WS<onclose>: ${message.type}`
                    }, ...this.state.toasts]
                });
            },
            onerror: (message) => {
                console.error('OnError: ', message);
                this.setToasts({ toasts:
                    [{
                        date: new Date(),
                        text: `WS<onerror>: ${message.type}`
                    }, ...this.state.toasts]
                });
            }
        }
        this.ws.open(listeners);
    }

    onScroll() {
        if (window.scrollY + window.innerHeight > document.body.scrollHeight - 200) {
            this.songsLoader = this.songsLoader
                .then(() => this.updateSongs());
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

    loadVideo(videoId) {
        this.ws.sendData(dataTypes.LOAD_VIDEO, { videoId })
    }

    render() {
        return (
            <div>
                <Toast data={this.state.toasts} setToasts={(v) => this.setToasts(v)}></Toast>
                <TopPanel 
                    ws={this.ws}
                    connect={() => this.connect()}
                    isConnected={this.state.isConnected}
                    volume={this.state.volume}
                    setVolume={(v) => this.setVolume(v)}
                    skip={this.state.skip}
                    setSkip={(v) => this.setSkip(v)}
                    limit={this.state.limit}
                    setLimit={(v) => this.setLimit(v)}
                    getSongs={(v) => this.getSongs(v)}
                />
                {/* <input type="text" onChange={e => {const t = e.target.value; this.handleSearchChange(t)}}></input> */}
                <div className="row pos-relative">
                    <div className="col s12 l6">
                        <TrackList songs={this.state.songs} findSong={(t) => this.searchVideo(t)} loadVideo={(id) => this.loadVideo(id)} />
                    </div>
                    <div ref={this.YTListRef} className="col s11 l6 smooth-transform transform-right-100 pos-fixed-sm right-0 grey darken-3 white-text z-depth-2-sm mt-4-sm">
                        <button className="btn btn-small hide-on-large-only pos-absolute transform-left-110 red" onClick={() => this.YTListRef.current.classList.toggle('transform-right-100')}>YT</button>
                        <YTList items={this.state.ytItems} loadVideo={(id) => this.loadVideo(id)} />
                    </div>
                </div>
                <BottomPanel />
            </div>
        );
    }
};
