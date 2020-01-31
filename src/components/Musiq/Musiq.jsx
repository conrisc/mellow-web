import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';
import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

import { YtPlayer } from './YtPlayer';
import { ToastList } from 'CommonComponents/ToastList';
import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';
import { TagList } from './TagList';

class MusiqX extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tags: []
        }
        this.getTags();
        this.musiqRef = React.createRef();
        this.heightResizer = debounce(100, () => this.musiqRef.current.style.height = window.innerHeight + 'px');
        this.webSocket = musiqWebsocket.getInstance({ setOnline: this.props.setOnline, setOffline: this.props.setOffline });
        const wsListeners = {
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                switch (dataFromServer.type) {
                    case dataTypes.NEW_MESSAGE:
                        console.log('WS <NEW_MESSAGE>: ', dataFromServer);
                        break;
                    case dataTypes.PLAY:
                        this.props.ytPlayer.playVideo();
                        this.pushToast('Playing video');
                        break;
                    case dataTypes.PAUSE:
                        this.props.ytPlayer.pauseVideo();
                        this.pushToast('Pausing video');
                        break;
                    case dataTypes.SET_VOLUME:
                        this.props.ytPlayer.setVolume(dataFromServer.volume);
                        this.pushToast(`Setting volume to ${dataFromServer.volume}`);
                        break;
                    case dataTypes.LOAD_VIDEO:
                        this.props.ytPlayer.loadVideoById(dataFromServer.videoId)
                        this.pushToast(`Loading video: ${dataFromServer.videoId}`);
                        break;
                }
            }
        };
        this.webSocket.addListeners(wsListeners);
    }

    componentDidMount() {
        document.querySelector('#manifest-placeholder').setAttribute('href', '/manifest-musiq.json');
        this.heightResizer();
        window.addEventListener('resize', this.heightResizer);
        this.webSocket.open();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.heightResizer);
        this.webSocket.close();
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
        this.props.pushToast({
            date: new Date(),
            text
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
                <ToastList />
                {this.props.ytPlayer &&
                    <div>
                        <TagList toggleTag={(tagElement) => this.toggleTag(tagElement)} tags={this.state.tags} />
                        <TopPanel />
                        <MainView
                            tags={this.state.tags}
                        />
                        <BottomPanel />
                    </div>
                }
                <YtPlayer />
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        pushToast: (toast) => dispatch({ type: 'PUSH_TOAST', toast }),
        setOnline: () => dispatch({ type: 'SET_ONLINE' }),
        setOffline: () => dispatch({ type: 'SET_OFFLINE' })
    };
}

export const Musiq = connect(mapStateToProps, mapDispatchToProps)(MusiqX);
