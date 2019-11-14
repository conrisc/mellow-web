import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';
import { YTList } from './YTList';
import { TopPanel } from './TopPanel';
import { BottomPanel } from './BottomPanel';
import { Toast } from './Toast';
import { TagsList } from './TagsList';

import { WSConnection } from '../services/wsConnection';
import { dataTypes } from '../constants/wsConstants';

export class Musiq extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ytItems: [],
            songs: [],
            volume: 100,
            skip: 0,
            limit: 20,
            toasts: [],
            isConnected: false,
            tags: []
        }
        this.player = null;
        this.YTListRef = React.createRef();
        this.songsLoader = this.getSongs();
        this.getTags();
        this.handleSearchChange = debounce(1000, () => this.searchVideo());
        this.onScrollDebounced = debounce(1000, () => this.onScroll())
        this.ws = new WSConnection();
    }

    componentDidMount() {
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
                        this.pushToast('Playing video');
                        break;
                    case dataTypes.PAUSE:
                        this.player.pauseVideo();
                        this.pushToast('Pausing video');
                        break;
                    case dataTypes.SET_VOLUME:
                        this.setState({ volume: dataFromServer.volume });
                        this.pushToast(`Setting volume to ${dataFromServer.volume}`);
                        this.player.setVolume(dataFromServer.volume);
                        break;
                    case dataTypes.LOAD_VIDEO:
                        this.playVideo(dataFromServer.videoId)
                        this.pushToast(`Loading video: ${dataFromServer.videoId}`);
                        break;
                }
            },
            onclose: (message) => {
                this.setState({ isConnected: false })
                this.pushToast(`WS<onclose>: ${message.type}`);
            },
            onerror: (message) => {
                this.setState({ isConnected: false })
                this.pushToast(`WS<onerror>: ${message.type}`);
            }
        }
        this.ws.open(listeners);
    }

    playVideo(videoId) {
        this.player.loadVideoById(videoId)
        this.player.playVideo();
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
            limit: this.state.limit,
            tags:  this.state.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: data })
            }, error => {
                this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    updateSongs () {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip + this.state.limit,
            limit: this.state.limit,
            tags:  this.state.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: [...this.state.songs, ...data] });
                this.setState({skip: this.state.skip + data.length});
            }, error => {
                this.pushToast('Cound not update songs');
                console.error(error);
            });
    }

     getTags() {
        const api = new DevelopersApi();

        const opts = {
            skip: 0,
            limit: 300
        };

        api.searchTag(opts)
            .then(data => {
                this.setState({
                    tags: data.map(tagItem => ({ tagItem, selected: false }))
                })
            }, error => {
                // this.pushToast('Cound not get songs');
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
        }).then(
            (response) => {
                const items = response.result ?
                    response.result.items.map(el => {
                        return {
                            title: el.snippet.title,
                            videoId: el.id.videoId,
                            thumbnailUrl: el.snippet.thumbnails.default.url
                        }
                    })
                    : [];
                this.setState({ ytItems: items })
            },
            (err) => {
                this.pushToast('Cound not search youtube videos');
                console.error("Execute error", err); 
            }
        );
    }

    loadVideo(videoId) {
        this.ws.sendData(dataTypes.LOAD_VIDEO, { videoId })
    }

    pushToast(text) {
        this.setState({ toasts:
            [{
                date: new Date(),
                text
            }, ...this.state.toasts]
        });
    }

    toggleTag(tagElement) {
        const newTags = this.state.tags.map(el => {
            if (tagElement.tagItem.id === el.tagItem.id)
                return { 
                    tagItem: tagElement.tagItem,
                    selected: !tagElement.selected
                }
            return el;
        });
        this.setState(
            { tags: newTags, skip: 0, limit: 20 },
            () => this.getSongs()
        );
    }

    render() {
        return (
            <div>
                <Toast data={this.state.toasts} setToasts={(v) => this.setState({ toasts: v })}></Toast>
                <TagsList toggleTag={(tagElement) => this.toggleTag(tagElement)} tags={this.state.tags} />
                <TopPanel 
                    ws={this.ws}
                    connect={() => this.connect()}
                    isConnected={this.state.isConnected}
                    volume={this.state.volume}
                    setVolume={(v) => this.setState({ volume: v })}
                    skip={this.state.skip}
                    setSkip={(v) => this.setState({ skip: v })}
                    limit={this.state.limit}
                    setLimit={(v) => this.setState({ limit: v })}
                    getSongs={(v) => this.getSongs(v)}
                />
                {/* <input type="text" onChange={e => {const t = e.target.value; this.handleSearchChange(t)}}></input> */}
                <div className="row pos-relative">
                    <div className="col s12 l6">
                        <TrackList
                            songs={this.state.songs}
                            tags={this.state.tags}
                            findSong={(t) => this.searchVideo(t)}
                            loadVideo={(id) => this.loadVideo(id)}
                            setItems={(r) => this.setState({ytItems: r})}
                            playVideo={(id) => this.playVideo(id)}
                        />
                    </div>
                    <div ref={this.YTListRef} className="col s11 l6 smooth-transform transform-right-100 pos-fixed-sm right-0 grey darken-3 white-text z-depth-2-sm mt-4-sm">
                        <button className="btn btn-small hide-on-large-only pos-absolute transform-left-110 red" onClick={() => this.YTListRef.current.classList.toggle('transform-right-100')}>YT</button>
                        <YTList
                            items={this.state.ytItems}
                            loadVideo={(id) => this.loadVideo(id)}
                            playVideo={(id) => this.playVideo(id)}
                        />
                    </div>
                </div>
                <BottomPanel />
            </div>
        );
    }
};
