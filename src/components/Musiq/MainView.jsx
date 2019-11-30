import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { dataTypes } from 'Constants/wsConstants';

import { SongList } from './SongList/SongList';
import { YtList } from './YtList';
import { ViewSwitch } from './ViewSwitch';

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ytItems: [],
            isFetchingYtItems: false
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

        const encodedTitle = encodeURIComponent(title);
        const opts = {
            limit: 10
        }

        console.log('Fetching yt items...');
        this.setState({
            isFetchingYtItems: true
        });
        this.mainViewRef.current.classList.add('transform-left-50');
        return api.getYtItems(encodedTitle, opts)
            .then(ytItems => {
                this.setState({
                    ytItems,
                    isFetchingYtItems: false
                });
                return ytItems;
            })
    }

    loadVideo(videoId) {
        this.props.ws.sendData(dataTypes.LOAD_VIDEO, { videoId })
    }

    render() {
        return (
            <div ref={this.mainViewRef} className="main-view row pos-relative smooth-transform">
                <div className="view-items">
                    <SongList
                        tags={this.props.tags}
                        loadVideo={(id) => this.loadVideo(id)}
                        player={this.props.player}
                        getYtItems={(t) => this.getYtItems(t)}
                    />
                    <YtList
                        ytItems={this.state.ytItems}
                        loadVideo={(id) => this.loadVideo(id)}
                        playVideo={(id) => this.props.playVideo(id)}
                        getYtItemsDebounced={(t) => this.getYtItemsDebounced(t)}
                        isFetchingYtItems={this.state.isFetchingYtItems}
                    />
                </div>
                <ViewSwitch mainViewRef={this.mainViewRef} />
            </div>
        );
    }
}