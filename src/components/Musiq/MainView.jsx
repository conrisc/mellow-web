import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

import { SongList } from './SongList/SongList';
import { YtList } from './YtList';
import { ViewSwitch } from './ViewSwitch';

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ytItems: [],
            isFetchingYtItems: false,
            visibleView: 0
        };
        this.getYtItemsDebounced = debounce(800, (t) => this.getYtItems(t));
        this.mainViewRef = React.createRef();
        this.webSocket = musiqWebsocket.getInstance();
        this.scrollPosition = [0, 0];
        this.onScrollDebounced = debounce(300, () => this.onScroll())
    }

    componentDidMount() {
        document.addEventListener('scroll', this.onScrollDebounced);
    }

    onScroll() {
        this.scrollPosition[this.state.visibleView] = document.firstElementChild.scrollTop;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.visibleView !== prevState.visibleView)
            document.firstElementChild.scrollTo(0, this.scrollPosition[this.state.visibleView]);
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
        this.webSocket.sendData(dataTypes.LOAD_VIDEO, { videoId })
    }

    setView(viewIndex) {
        this.setState({...this.state,
            visibleView: viewIndex
        });
    }

    showYtTab() {
        this.setState({...this.state,
            visibleView: 1
        });
    }

    getViews() {
        return [
            {
                item:
                    <SongList
                        isActive={this.state.visibleView === 0}
                        tags={this.props.tags}
                        loadVideo={id => this.loadVideo(id)}
                        getYtItems={t => this.getYtItems(t)}
                        showYtTab={() => this.showYtTab()}
                    />,
                name: 'SONG LIST',
                customClasses: ''
            },
            {
                item:
                    <YtList
                        ytItems={this.state.ytItems}
                        loadVideo={id => this.loadVideo(id)}
                        getYtItemsDebounced={t => this.getYtItemsDebounced(t)}
                        isFetchingYtItems={this.state.isFetchingYtItems}
                    />,
                name: 'YT LIST',
                customClasses: 'red'
            }
        ];
    }

    render() {
        const views = this.getViews();
        const nextViewIndex = (this.state.visibleView + 1) % views.length;
        return (
            <div ref={this.mainViewRef} className="main-view row pos-relative">
                {this.getViews()
                    .map((view, index)=> (
                        <div key={index} className={index === this.state.visibleView ? '' : 'd-none-sm'}>
                            {view.item}
                        </div>
                    ))
                }
                <ViewSwitch
                    switchView={() => this.setView(nextViewIndex)}
                    nextViewName={views[nextViewIndex].name}
                    customClasses={views[nextViewIndex].customClasses}
                />
            </div>
        );
    }
}