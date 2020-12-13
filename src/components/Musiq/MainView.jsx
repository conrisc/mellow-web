import React from 'react';
import { debounce } from 'throttle-debounce';
import { UsersApi } from 'what_api';
import { Row, Col } from 'antd';

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
        this.scrollPositions = [0, 0];
        this.webSocket = musiqWebsocket.getInstance();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.visibleView !== this.state.visibleView) {
            document.documentElement.scrollTo(0, this.scrollPositions[this.state.visibleView]);
        }
    }

    getYtItems(title) {
        if (!title || title === '') {
            console.log('getYtItems: title is empty');
            return;
        }
        const api = new UsersApi();

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
                name: 'SONG LIST',
                customStyles: '',
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
                customStyles: 'yt-list',
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
                            xs={{span: index === this.state.visibleView ? 24 : 0}}
                            sm={{span: index === this.state.visibleView ? 24 : 0}}
                            lg={{span: 12}}
                            className={view.customStyles}>
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