import React from 'react';
import { debounce } from 'throttle-debounce';
import { Row, Col } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';

import { SongList } from './SongList/SongList';
import { YtList } from './YtList';
import { ViewSwitch } from './ViewSwitch';
import { getUsersApi } from 'Services/mellowApi';

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
        this.scrollPositions = [0, 0];
        this.webSocket = musiqWebsocket.getInstance();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.visibleView !== this.state.visibleView) {
            document.documentElement.scrollTo(0, this.scrollPositions[this.state.visibleView]);
        }
    }

    async getYtItems(title) {
        if (!title || title === '') {
            console.log('getYtItems: title is empty');
            return;
        }
        const api = await getUsersApi();

        const encodedTitle = encodeURIComponent(title);
        const limit = 10;

        console.log('Fetching yt items for song:', title);
        this.setState({
            isFetchingYtItems: true
        });
        return api.searchYtItems(encodedTitle, limit)
            .then(ytItems => {
                this.setState({
                    ytItems,
                    isFetchingYtItems: false
                });
                return ytItems;
            })
    }

    loadVideo(videoId) {
        this.webSocket.sendDataToTargets(dataTypes.LOAD_VIDEO, { videoId })
    }

    setView(viewIndex) {
        this.scrollPositions[this.state.visibleView] = document.documentElement.scrollTop;
        this.setState({...this.state,
            visibleView: viewIndex
        });
    }

    showYtTab() {
        this.setView(1);
    }

    getViews() {
        return [
            {
                item:
                    <SongList
                        isActive={this.state.visibleView === 0}
                        loadVideo={id => this.loadVideo(id)}
                        getYtItems={t => this.getYtItems(t)}
                        showYtTab={() => this.showYtTab()}
                    />,
                span: 16,
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
                span: 8,
                name: 'YT LIST',
                customClasses: 'red'
            }
        ];
    }

    render() {
        const views = this.getViews();
        const nextViewIndex = (this.state.visibleView + 1) % views.length;
        return (
            <Row className="pos-relative">
                {this.getViews()
                    .map((view, index)=> (
                        <Col key={index}
                            xs={index === this.state.visibleView ? 24 : 0}
                            sm={index === this.state.visibleView ? 24 : 0}
                            lg={view.span}
                        >
                            {view.item}
                        </Col>
                    ))
                }
                <ViewSwitch
                    switchView={() => this.setView(nextViewIndex)}
                    nextViewName={views[nextViewIndex].name}
                    customClasses={views[nextViewIndex].customClasses}
                />
            </Row>
        );
    }
}