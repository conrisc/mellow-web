import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { Spinner } from 'CommonComponents/Spinner';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';
import { NewSongModal } from './NewSongModal';


export class SongList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            titleFilter: '',
            skip: 0,
            limit: 30,
            songs: [],
            sort: 'none',
            shouldShowSongs: false,
            shouldShowLoader: true,
            currentlyPlaying: null
        }
        this.getSongsDebounced = debounce(800, () => this.songsLoader.then(() => this.getSongs()));
        this.onScrollDebounced = debounce(800, () => this.onScroll())
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
        this.setState({
            shouldShowSongs: false,
            shouldShowLoader: true
        });
        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            title: this.state.titleFilter,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id),
            sort: this.state.sort
        };

        console.log('Fetching songs...');
        const api = new DevelopersApi();
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
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id),
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
        const api = new DevelopersApi();
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
                        this.loadVideoById(videoIdMatch[1], nextVideoIndex);
                    else
                        this.props.getYtItems(songItem.title)
                            .then(ytItems => {
                                this.loadVideoById(ytItems[0].videoId, nextVideoIndex);
                            })
                }
            })
        })
    }

    loadVideoById(videoId, index) {
        this.props.playerLoader.then(player => {
            player.loadVideoById(videoId)
        });
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

    render() {
        return (
            <div ref={this.songListRef} className="single-view col s6">
                <NewSongModal 
                    tags={this.props.tags}
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
                                        updateSingleSong={s => this.updateSingleSong(s)}
                                    />
                                    <SongActionButtons 
                                        index={index}
                                        songItem={songItem}
                                        videoId={videoId}
                                        getYtItems={this.props.getYtItems}
                                        showYtTab={this.props.showYtTab}
                                        loadVideo={this.props.loadVideo}
                                        loadVideoById={(id, i) => this.loadVideoById(id, i)}
                                        removeSong={(id) => this.removeSong(id)}
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
