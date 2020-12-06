import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';
import { Button } from 'antd';
import { UsersApi } from 'what_api';
import { List, Row, Col } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { Spinner } from 'CommonComponents/Spinner';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';
import { NewSongModal } from './NewSongModal';
import { TagList } from './TagList';

class SongListX extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            titleFilter: '',
            skip: 0,
            limit: 30,
            songs: [],
            tags: [],
            sort: 'none',
            shouldShowSongs: false,
            shouldShowLoader: true,
            currentlyPlaying: null,
            isTagDrawerVisible: false,
            isNewSongModalVisible: false
        };
        this.getTags();
        this.loadingVideo = false;
        this.getSongsDebounced = debounce(800, () => this.songsLoader.then(() => this.getSongs()));
        this.onScrollDebounced = debounce(800, () => this.onScroll())
    }

    componentDidMount() {
        this.songsLoader = this.getSongs();
        document.addEventListener('scroll', this.onScrollDebounced);
        this.initAutoplay();
        const webSocket = musiqWebsocket.getInstance();
        const wsListeners = {
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                switch (dataFromServer.type) {
                    case dataTypes.NEXT_SONG:
                        this.playNextSong();
                        this.props.pushToast('Play next song');
                        break;
                    case dataTypes.PREV_SONG:
                        this.playPreviousSong();
                        this.props.pushToast('Play previous song');
                        break;
                }
            }
        };
        webSocket.addListeners(wsListeners);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.onScrollDebounced);
    }

    getTags() {
        const api = new UsersApi();

        const opts = {
            skip: 0,
            limit: 300
        };

        api.searchTag(opts)
            .then(data => {
                this.setState({
                    tags: data.map(tagItem => ({ tagItem, selected: false }))
                })
                this.getSongsDebounced();
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
        this.getSongsDebounced();
    }

    getSongs() {
        this.setState({
            shouldShowSongs: false,
            shouldShowLoader: true
        });
        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            title: this.state.titleFilter,
            tags:  this.state.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id),
            sort: this.state.sort
        };

        console.log('Fetching songs...');
        const api = new UsersApi();
        return api.searchSong(opts)
            .then(data => {
                this.setState({
                    songs: data,
                    shouldShowSongs: true,
                    shouldShowLoader: false,
                    currentlyPlaying: null
                });
            }, error => {
                // this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    updateSongs () {
        const api = new UsersApi();

        const opts = {
            skip: this.state.skip + this.state.limit,
            limit: this.state.limit,
            title: this.state.titleFilter,
            tags:  this.state.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id),
            sort: this.state.sort
        };

        this.setState({
            shouldShowLoader: true
        });
        return api.searchSong(opts)
            .then(data => {
                this.setState({
                    songs: [...this.state.songs, ...data],
                    skip: this.state.skip + data.length,
                    shouldShowLoader: false
                });
            }, error => {
                // this.pushToast('Cound not update songs');
                console.error(error);
            });
    }

    removeSong(songId) {
        const api = new UsersApi();
        api.removeSong(songId)
            .then(() => {
                this.setState({
                    songs: this.state.songs.filter(songItem => songItem.id !== songId)
                })
                console.log('Song successfuly removed');
            }, error => {
                console.error(error);
            });
    }


    onScroll() {
        if (!this.props.isActive) return;

        const element = document.documentElement;
        if (element.clientHeight + element.scrollTop > element.scrollHeight - 100) {
            this.songsLoader = this.songsLoader
                .then(() => this.updateSongs());
        }
    }

    playPreviousSong() {
        if (this.state.currentlyPlaying > 0) {
            const previousVideoIndex = this.state.currentlyPlaying - 1;
            const songItem = this.state.songs[previousVideoIndex];
            if (songItem) {
                const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);

                if (videoIdMatch)
                    this.loadVideoById(videoIdMatch[1], previousVideoIndex);
                else
                    this.props.getYtItems(songItem.title)
                        .then(ytItems => {
                            this.loadVideoById(ytItems[0].videoId, previousVideoIndex);
                        })
            }
        }
    }

    playNextSong() {
        const nextVideoIndex = this.state.currentlyPlaying === null ? 0 : this.state.currentlyPlaying + 1;

        const playNextSong = () => {
            const songItem = this.state.songs[nextVideoIndex];
            if (songItem) {
                const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);

                if (videoIdMatch)
                    this.loadVideoById(videoIdMatch[1], nextVideoIndex);
                else
                    this.props.getYtItems(songItem.title)
                        .then(ytItems => {
                            this.loadVideoById(ytItems[0].videoId, nextVideoIndex);
                        })
            }
        }

        if (nextVideoIndex >= this.state.songs.length) {
            this.songsLoader = this.songsLoader
                .then(() => this.updateSongs())
                .then(playNextSong);
        } else {
            playNextSong();
        }
    }

    initAutoplay() {
        this.props.ytPlayer.addEventListener('onStateChange', state => {
            if (state.data === 1) {
                this.loadingVideo = false;
            }
            if (state.data === 3) {
                this.loadingVideo = true;
            }
            if (state.data === -1 && this.loadingVideo) {
                this.loadingVideo = false;
                const songItem = this.state.songs[this.state.currentlyPlaying];
                this.props.getYtItems(songItem.title)
                    .then(ytItems => {
                        this.loadVideoById(ytItems[0].videoId, this.state.currentlyPlaying);
                    });
            }
            if (state.data === 0) {
                this.playNextSong();
            }
        });
    }

    loadVideoById(videoId, index) {
        this.props.ytPlayer.loadVideoById(videoId);
        this.setState({ currentlyPlaying: index });
    }

    updateSingleSong(updatedSongItem) {
        this.setState({
            songs: this.state.songs.map(songItem => {
                return songItem.id === updatedSongItem.id ?
                    updatedSongItem :
                    songItem;
            })
        });
    }

    findAndPlayVideo(songItem, index) {
        this.props.getYtItems(songItem.title)
            .then(ytItems => {
                this.loadVideoById(ytItems[0].videoId, index);
            })
    }

    setIsTagDrawerVisible(isTagDrawerVisible) {
        this.setState({ isTagDrawerVisible })
    }

    setIsNewSongModalVisible(isNewSongModalVisible) {
        this.setState({ isNewSongModalVisible })
    }

    render() {
        return (
            <div style={{ padding: '16px' }}>
                <TagList
                    toggleTag={(tagElement) => this.toggleTag(tagElement)}
                    tags={this.state.tags}
                    isVisible={this.state.isTagDrawerVisible}
                    setIsVisible={(i) => this.setIsTagDrawerVisible(i)}
                />
                <NewSongModal 
                    tags={this.state.tags}
                    isVisible={this.state.isNewSongModalVisible}
                    closeModal={() => this.setIsNewSongModalVisible(false)}
                />
                <SongFilterPanel
                    titleFilter={this.state.titleFilter}
                    setTitleFilter={titleFilter => this.setState({ titleFilter })}
                    skip={this.state.skip}
                    setSkip={skip => this.setState({skip})}
                    limit={this.state.limit}
                    setLimit={limit => this.setState({limit})}
                    sort={this.state.sort}
                    setSort={sort => this.setState({sort})}
                    getSongsDebounced={this.getSongsDebounced}
                    showTagsDrawer={() => this.setIsTagDrawerVisible(true)}
                    showNewSongModal={() => this.setIsNewSongModalVisible(true)}
                />
                <List
                    rowKey="id"
                    loading={this.state.shouldShowLoader}
                    dataSource={this.state.songs}
                    renderItem={(songItem, index) => {
                        const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                        const videoId = videoIdMatch ? videoIdMatch[1] : '';
                        return (
                            <List.Item
                                className={index === this.state.currentlyPlaying ? ' grey lighten-4' : ''} 
                                extra={
                                    <SongActionButtons 
                                        songItem={songItem}
                                        videoId={videoId}
                                        getYtItems={this.props.getYtItems}
                                        showYtTab={this.props.showYtTab}
                                        loadVideo={this.props.loadVideo}
                                        loadVideoById={(id, i) => this.loadVideoById(id, i)}
                                        removeSong={(id) => this.removeSong(id)}
                                    />
                                }
                            >
                                <Row gutter={16}>
                                    <Col>
                                        <Button type="primary"
                                            onClick={videoId ? () => this.loadVideoById(videoId, index) : () => this.findAndPlayVideo(songItem, index)}
                                            title="Play song on this device">
                                                <i className="fas fa-play"></i>
                                        </Button>
                                    </Col>
                                    <Col>
                                        <SongInfoContainer
                                            songItem={songItem}
                                            tags={this.state.tags}
                                            updateSingleSong={s => this.updateSingleSong(s)}
                                        />
                                    </Col>
                                </Row>
                            </List.Item>
                        );
                    }}
                />
                {/* <div className={'center-align' + (this.state.shouldShowLoader ? '' : ' hide')}>
                    <Spinner />
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        pushToast: (toast) => dispatch({ type: 'PUSH_TOAST', toast })
    };
}

export const SongList = connect(mapStateToProps, mapDispatchToProps)(SongListX);
