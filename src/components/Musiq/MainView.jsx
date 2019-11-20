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
        this.YTListRef = React.createRef();
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
            <div className="row pos-relative">
                <SongList
                    tags={this.props.tags}
                    loadVideo={(id) => this.loadVideo(id)}
                    playVideo={(id, i) => this.props.playVideo(id, i)}
                    getYtItems={(t) => this.getYtItems(t)}
                />
                <div ref={this.YTListRef} className="col s12 l6 smooth-transform transform-right-100 pos-fixed-sm right-0 grey darken-3 white-text z-depth-2-sm mt-4-sm">
                    <button className="btn btn-small hide-on-large-only pos-absolute transform-left-110 red" onClick={() => this.YTListRef.current.classList.toggle('transform-right-100')}>YT</button>
                    <YtList
                        ytItems={this.state.ytItems}
                        loadVideo={(id) => this.loadVideo(id)}
                        playVideo={(id) => this.props.playVideo(id)}
                        getYtItemsDebounced={(t) => this.getYtItemsDebounced(t)}
                    />
                </div>
            </div>
        );
    }
}