import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { WSConnection } from 'Services/wsConnection';
import { dataTypes } from 'Constants/wsConstants';

import { Toast } from 'CommonComponents/Toast';
import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';
import { TagList } from './TagList';

export class Musiq extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            volume: 100,
            toasts: [],
            isConnected: false,
            tags: []
        }
        this.getTags();
        this.ws = new WSConnection(true, 10000);
        this.musiqRef = React.createRef();
        this.heightResizer = debounce(100, () => this.musiqRef.current.style.height = window.innerHeight + 'px');
        this.playerLoader = loadYT.then(YT => {
            return new YT.Player('yt-player', {
                height: 360,
                width: 640
            });
        });

        this.wsListeners = {
            open: () => {
                this.setState({ isConnected: true });
            },
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                console.log('WS <onmessage>: ', dataFromServer);
                switch (dataFromServer.type) {
                    case dataTypes.NEW_MESSAGE:
                        console.log('WS <NEW_MESSAGE>: ', dataFromServer);
                        break;
                    case dataTypes.PLAY:
                        this.playerLoader.then(player => {
                            player.playVideo();
                        });
                        this.pushToast('Playing video');
                        break;
                    case dataTypes.PAUSE:
                        this.playerLoader.then(player => {
                            player.pauseVideo();
                        });
                        this.pushToast('Pausing video');
                        break;
                    case dataTypes.SET_VOLUME:
                        this.setState({ volume: dataFromServer.volume });
                        this.pushToast(`Setting volume to ${dataFromServer.volume}`);
                        this.playerLoader.then(player => {
                            player.setVolume(dataFromServer.volume);
                        });
                        break;
                    case dataTypes.LOAD_VIDEO:
                        this.playVideo(dataFromServer.videoId)
                        this.pushToast(`Loading video: ${dataFromServer.videoId}`);
                        break;
                }
            },
            close: (message) => {
                this.setState({ isConnected: false })
                this.pushToast(`WS<onclose>: ${message.type}`);
            },
            error: (message) => {
                this.setState({ isConnected: false })
                this.pushToast(`WS<onerror>: ${message.type}`);
            }
        }
    }

    componentDidMount() {
        document.querySelector('#manifest-placeholder').setAttribute('href', '/manifest-musiq.json');
        this.heightResizer();
        window.addEventListener('resize', this.heightResizer);
        this.connect();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.heightResizer);
        this.ws.close(this.wsListeners);
    }

    connect() {
        this.ws.open(this.wsListeners);
    }

    playVideo(videoId) {
        this.playerLoader.then(player => {
            player.loadVideoById(videoId)
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
            { tags: newTags }
        );
    }

    render() {
        return (
            <div ref={this.musiqRef} className="musiq">
                <Toast data={this.state.toasts} setToasts={(v) => this.setState({ toasts: v })}></Toast>
                <TagList toggleTag={(tagElement) => this.toggleTag(tagElement)} tags={this.state.tags} />
                <TopPanel 
                    ws={this.ws}
                    connect={() => this.connect()}
                    isConnected={this.state.isConnected}
                    volume={this.state.volume}
                    setVolume={(v) => this.setState({ volume: v })}
                />
                <MainView 
                    ws={this.ws}
                    tags={this.state.tags}
                    playVideo={id => this.playVideo(id)}
                    playerLoader={this.playerLoader}
                />
                <BottomPanel 
                    playerLoader={this.playerLoader}
                />
            </div>
        );
    }
};
