import React, { useState, useEffect, useReducer, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { List, Row, Col, notification } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';
import { TagList } from './TagList';
import { EditSongModal } from './EditSongModal';
import { TagsProvider, useTagsState } from './TagsContext';

import { useScroll } from 'Hooks/useScroll';
import { useSongs } from 'Hooks/useSongs';
import { usePlayerStatus } from 'Hooks/usePlayerStatus';

function switchSong({ currentlyPlaying }, action) {
    switch (action.type) {
        case 'PLAY_PREVIOUS':
            console.log('switchSong: Play previous');
            if (currentlyPlaying > 0)
                return { currentlyPlaying: currentlyPlaying - 1 };
            break;
        case 'PLAY_NEXT':
            console.log('switchSong: Play next');
            return {
                currentlyPlaying: currentlyPlaying === null
                    ? 0
                    : currentlyPlaying + 1
            }
        case 'PLAY_BY_INDEX':
            console.log('switchSong: Play by index: ', action.songIndex);
            return {
                currentlyPlaying: isNaN(action.songIndex)
                    ? null
                    : action.songIndex
            }
        case 'RESET':
            console.log('switchSong: Reset');
            return {
                currentlyPlaying: null
            }
        default:
            throw new Error(`switchSong: Action ${action.type} is not recognizable`);
    }
}

// TODO:
// update currentlyPlaying after removing/adding a new song
// onClick "Play" for the current song (it should try to replay that song (maybe, im not sure yet))
// reload songs only on tag selection change

function SongListX(props) {
    const { ytPlayer } = props;
    const playerStatus = usePlayerStatus(ytPlayer);
    const { tags } = useTagsState();
    const [songFilters, setSongFilters] = useState({
        title: '',
        skip: 0,
        limit: 30,
        sort: 'added_date_desc'
    });

    const { songs, getSongs, loadMoreSongs, addSong, updateSong, removeSong } = useSongs(tags, songFilters);
    const [isLoadingSongs, setIsLoadingSongs] = useState(true);
    const [{ currentlyPlaying }, dispatch] = useReducer(switchSong, { currentlyPlaying: null });
    const [isTagDrawerOpen, setIsTagDrawerOpen] = useState(false);
    const [editedSong, setEditedSong] = useState(null);
    const { scrollPosition, scrollHeight } = useScroll();
    const songsLoaderRef = useRef(null);
    const hasMoreSongs = useRef(true);
    const allowedRetries = useRef(0);

    useEffect(() => {
        const webSocket = musiqWebsocket.getInstance();
        const wsListeners = {
            message: (message) => {
                const dataFromServer = JSON.parse(message.data);
                switch (dataFromServer.type) {
                    case dataTypes.NEXT_SONG:
                        dispatch({type: 'PLAY_NEXT'})
                        pushNotification('Play next song');
                        break;
                    case dataTypes.PREV_SONG:
                        dispatch({type: 'PLAY_PREVIOUS'})
                        pushNotification('Play previous song');
                        break;
                }
            }
        };
        webSocket.addListeners(wsListeners);
    }, []);

    // Refetch songs without a delay
    useEffect(() => {
        clearTimeout(songsLoaderRef.current);
        reloadSongs();
    }, [songFilters.limit, songFilters.sort]);

    // Refetch songs with a delay (debounced)
    useEffect(() => {
        songsLoaderRef.current = setTimeout(reloadSongs, 800);

        return () => {
            clearTimeout(songsLoaderRef.current);
        }
    }, [tags, songFilters.skip, songFilters.title]);

    // Load more songs on scroll to bottom
    useEffect(() => {
        if (props.isActive && songs.length > 0 && scrollHeight - scrollPosition < 100) {
            loadMore();
        }
    }, [scrollPosition]);

    // Handle player's status change
    useEffect(() => {
        switch(playerStatus) {
            case 'FAILED':
                if (allowedRetries.current > 0) {
                    if (allowedRetries.current === 1) playSongFromYT(1);
                    else playSongFromYT();

                    allowedRetries.current--;
                }
                break;
            case 'ENDED':
                dispatch({ type: 'PLAY_NEXT' });
                break;
        }
    }, [playerStatus]);

    // Play a song with index equal to the currentlyPlaying
    useEffect(() => {
        allowedRetries.current = 3;
        if (typeof currentlyPlaying === 'number' && currentlyPlaying >= songs.length) {
            loadMore()
                .then(playSong);
        } else {
            playSong();
        }
    }, [currentlyPlaying]);

    function playSong() {
        const songItem = songs[currentlyPlaying];
        if (songItem) {
            const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);
            if (videoIdMatch)
                ytPlayer.loadVideoById(videoIdMatch[1]);
            else
                playSongFromYT();
        }
    }

    function playSongFromYT(index = 0) {
        const songItem = songs[currentlyPlaying];
        if (songItem) {
            props.getYtItems(songItem.title)
                .then(ytItems => {
                    ytPlayer.loadVideoById(ytItems.length > index ? ytItems[index].videoId : 'fakeVideoId'); // workaround for autoretry
                });
        }
    }

    function pushNotification(text) {
        notification.open({
            message: 'Song list notification',
            description: text
        });
    }

    function reloadSongs() {
        document.documentElement.scrollTo(0, 0);
        setIsLoadingSongs(true);
        getSongs()
            .finally(() => {
                hasMoreSongs.current = true;
                setIsLoadingSongs(false);
                dispatch({ type: 'RESET' });
            });
    }

    function loadMore() {
        if (!hasMoreSongs.current || isLoadingSongs) return Promise.resolve();

        setIsLoadingSongs(true);
        return loadMoreSongs()
            .then(({ fetched }) => {
                if (fetched === 0) hasMoreSongs.current = false;
                setIsLoadingSongs(false);
            });
    }

    function onSongClick(songIndex) {
        if (songIndex === currentlyPlaying) {
            switch(playerStatus) {
                case 'LOADED':
                    ytPlayer.pauseVideo();
                    break;
                case 'PAUSED':
                case 'ENDED':
                    ytPlayer.playVideo();
                    break;
                case 'FAILED':
                    playSongFromYT();
                    break;
            }
        } else {
            dispatch({ type: 'PLAY_BY_INDEX', songIndex });
        }
    }

    function getIconForCurrentSong() {
        switch(playerStatus) {
            case 'PAUSED':
                return  <div><i className="fas fa-pause-circle"></i></div>
            case 'ENDED':
                return  <div><i className="fas fa-play-circle"></i></div>
            case 'FAILED':
                return  <p><i className="fas fa-exclamation-circle"></i></p>
            case 'LOADED':
            default:
                return  <span><i className="fas fa-compact-disc fa-spin"></i></span>
        }
    }

    return (
        <Row>
            <Col xs={0} lg={6}>
                <TagList
                    isOpen={isTagDrawerOpen}
                    setIsOpen={(i) => setIsTagDrawerOpen(i)}
                />
            </Col>
            <Col xs={24} lg={18}>
                {editedSong && <EditSongModal
                    isOpen={!!editedSong}
                    closeModal={() => setEditedSong(null)}
                    songItem={editedSong}
                    updateSong={updateSong}
                />}
                <SongFilterPanel
                    addSong={addSong}
                    songFilters={songFilters}
                    setSongFilters={setSongFilters}
                    showTagsDrawer={() => setIsTagDrawerOpen(true)}
                    showNewSongModal={() => setIsNewSongModalVisible(true)}
                />
                <List
                    className="song-list"
                    rowKey="id"
                    size="small"
                    loading={isLoadingSongs}
                    dataSource={songs}
                    renderItem={(songItem, index) => {
                        const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                        const videoId = videoIdMatch ? videoIdMatch[1] : '';
                        return (
                            <List.Item
                                onClick={() => onSongClick(index)}
                                className={'song-item f-size-medium' + (index === currentlyPlaying ? ' item-selected' : '')}
                                extra={
                                    <SongActionButtons
                                        songItem={songItem}
                                        videoId={videoId}
                                        getYtItems={props.getYtItems}
                                        showYtTab={props.showYtTab}
                                        loadVideo={props.loadVideo}
                                        editSong={() => setEditedSong(songItem)}
                                        removeSong={(id) => removeSong(id)}
                                    />
                                }
                            >
                                <Row gutter={16} style={{ flexWrap: 'nowrap' }}>
                                    <Col style={{ fontSize: 32, color: '#6158c4' }}>
                                        {index === currentlyPlaying
                                            ? <div>{getIconForCurrentSong()}</div>    // icon needs to be wrapped up so React could hold a reference to it
                                            : <span><i className="fas fa-play-circle"></i></span>
                                        }
                                    </Col>
                                    <Col>
                                        <SongInfoContainer
                                            songItem={songItem}
                                        />
                                    </Col>
                                </Row>
                            </List.Item>
                        );
                    }}
                />
            </Col>
        </Row>
    );
}

const mapStateToProps = state => (
    {
        ytPlayer: state.ytPlayer
    }
);

const mapDispatchToProps = dispatch => ({});

const SongListConnected = connect(mapStateToProps, mapDispatchToProps)(SongListX);

export function SongList(props) {
    return (
        <TagsProvider>
            <SongListConnected {...props} />
        </TagsProvider>
    );
}
