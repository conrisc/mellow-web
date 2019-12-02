import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { Spinner } from 'CommonComponents/Spinner';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';

export class SongList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            titleFilter: '',
            skip: 0,
            limit: 30,
            songs: [],
            shouldShowSongs: false,
            shouldShowLoader: true,
            currentlyPlaying: null
        }
        this.getSongsDeb = debounce(1000, () => this.songsLoader.then(() => this.getSongs()));
        this.getSongsDebounced = () => {
            this.setState({
                shouldShowSongs: false,
                shouldShowLoader: true
            });
            this.getSongsDeb();
        }
        this.onScrollDebounced = debounce(1000, () => this.onScroll())
        this.songListRef = React.createRef();
    }

    componentDidMount() {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        M.updateTextFields();
        this.songsLoader = this.getSongs();
        this.songListRef.current.addEventListener('scroll', this.onScrollDebounced);
        this.initAutoplay();
    }

    componentDidUpdate(prevProps) {
        if (this.props.tags !== prevProps.tags) {
            this.getSongsDebounced();
        }
    }

    componentWillUnmount() {
        this.songListRef.current.removeEventListener('scroll', this.onScrollDebounced);
    }

    getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            title: this.state.titleFilter,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        console.log('Fetching songs...');
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
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip + this.state.limit,
            limit: this.state.limit,
            title: this.state.titleFilter,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
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

    onScroll() {
        if (this.songListRef.current.clientHeight + this.songListRef.current.scrollTop > this.songListRef.current.scrollHeight - 100) {
            this.songsLoader = this.songsLoader
                .then(() => this.updateSongs());
        }
    }

    initAutoplay() {
        this.props.playerLoader.then(player => {
            player.addEventListener('onStateChange', state => {
                const nextVideoIndex = this.state.currentlyPlaying + 1;
                const songItem = this.state.songs[nextVideoIndex];
                if (state.data === 0 && songItem) {
                    const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);

                    if (videoIdMatch)
                        this.playVideo(videoIdMatch[1], nextVideoIndex);
                    else
                        this.props.getYtItems(songItem.title)
                            .then(ytItems => {
                                this.playVideo(ytItems[0].videoId, nextVideoIndex);
                            })
                }
            })
        })
    }

    playVideo(videoId, index) {
        this.props.playerLoader.then(player => {
            player.loadVideoById(videoId)
        });
        this.setState({ currentlyPlaying: index });
    }

    render() {
        return (
            <div ref={this.songListRef} className="single-view col s6">
                <SongFilterPanel
                    titleFilter={this.state.titleFilter}
                    setTitleFilter={titleFilter => this.setState({ titleFilter })}
                    skip={this.state.skip}
                    setSkip={skip => this.setState({skip})}
                    limit={this.state.limit}
                    setLimit={limit => this.setState({limit})}
                    getSongsDebounced={this.getSongsDebounced}

                />
                <ul className={'collection' + (this.state.shouldShowSongs ? '' : ' hide')}>
                    {
                        this.state.songs.map((songItem, index) => {
                            const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                            const videoId = videoIdMatch ? videoIdMatch[1] : '';
                            return (
                                <li className={"collection-item row" + (index === this.state.currentlyPlaying ? ' blue-grey lighten-4' : '')} key={songItem.id}>
                                    <SongInfoContainer
                                        songItem={songItem}
                                        tags={this.props.tags}
                                    />
                                    <SongActionButtons 
                                        index={index}
                                        songItem={songItem}
                                        videoId={videoId}
                                        getYtItems={this.props.getYtItems}
                                        loadVideo={this.props.loadVideo}
                                        playVideo={(id, i) => this.playVideo(id, i)}
                                    />
                                </li>
                            );
                        })
                    }
                </ul>
                <div className={'center-align' + (this.state.shouldShowLoader ? '' : ' hide')}>
                    <Spinner />
                </div>
            </div>
        );
    }
}
