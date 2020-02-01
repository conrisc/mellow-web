import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { musiqWebsocket } from 'Services/musiqWebsocket';
import { ToastList } from 'CommonComponents/ToastList';
import { YtPlayer } from './YtPlayer';
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
        this.webSocket = musiqWebsocket.getInstance({ setOnline: this.props.setOnline, setOffline: this.props.setOffline });
    }

    componentDidMount() {
        document.querySelector('#manifest-placeholder').setAttribute('href', '/manifest-musiq.json');
        this.webSocket.open();
    }

    componentWillUnmount() {
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
                console.error(error);
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
            <div>
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
        setOnline: () => dispatch({ type: 'SET_ONLINE' }),
        setOffline: () => dispatch({ type: 'SET_OFFLINE' })
    };
}

export const Musiq = connect(mapStateToProps, mapDispatchToProps)(MusiqX);
