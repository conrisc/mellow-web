import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { SongList } from './SongList/SongList';
import { YtList } from './YtList';

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ytItems: []
        };
        this.getYtItemsDebounced = debounce(1000, (t) => this.getYtItems(t));
        this.mainViewRef = React.createRef();
    }

    getYtItems(title) {
        if (!title || title === '') {
            console.log('getYtItems: title is empty');
            return;
        }
        const api = new DevelopersApi();

        const opts = {
            limit: 10
        }

        api.getYtItems(title, opts)
            .then(ytItems => {
                this.setState({ ytItems });
            })
    }


    loadVideo(videoId) {
        this.ws.sendData(dataTypes.LOAD_VIDEO, { videoId })
    }

    render() {
        return (
            <div ref={this.mainViewRef} className="main-view row pos-relative smooth-transform">
                <button className="switch-button btn btn-small pos-fixed-sm hide-on-large-only red" onClick={() => this.mainViewRef.current.classList.toggle('transform-left-50')}>SWITCH</button>
                <SongList
                    tags={this.props.tags}
                    loadVideo={(id) => this.loadVideo(id)}
                    playVideo={(id, i) => this.props.playVideo(id, i)}
                    getYtItems={(t) => this.getYtItems(t)}
                />
                <YtList
                    ytItems={this.state.ytItems}
                    loadVideo={(id) => this.loadVideo(id)}
                    playVideo={(id) => this.props.playVideo(id)}
                    getYtItemsDebounced={(t) => this.getYtItemsDebounced(t)}
                />
            </div>
        );
    }
}