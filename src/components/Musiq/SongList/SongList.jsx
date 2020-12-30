import React, { useState, useEffect, useReducer, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { List, Row, Col, notification } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';
import { NewSongModal } from './NewSongModal';
import { TagList } from './TagList';
import { EditSongModal } from './EditSongModal';

import { useScroll } from 'CommonComponents/useScroll';
import { useTags } from './useTags';
import { useSongs } from './useSongs';

let loadingVideo = false;

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
// init autoplay
// update song list after adding a song
// move api request to useSongs (on song remove, on song update)

function SongListX(props) {
    const { tags, toggleTag } = useTags();
    const [songFilters, setSongFilters] = useState({
        title: '',
        skip: 0,
        limit: 30,
        sort: 'none'
    });

    const { songs, getSongs, loadMoreSongs, updateSingleSong, removeSong } = useSongs(tags, songFilters);
    const [shouldShowLoader, setShouldShowLoader] = useState(true);
    const [{ currentlyPlaying }, dispatch] = useReducer(switchSong, { currentlyPlaying: null });
    const [isTagDrawerVisible, setIsTagDrawerVisible] = useState(false);
    const [isNewSongModalVisible, setIsNewSongModalVisible] = useState(false);
    const [editedSong, setEditedSong] = useState(null);
    const { scrollPosition, scrollHeight } = useScroll();
    const songsLoaderRef = useRef(null);


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
        // initAutoplay();
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
        if (props.isActive && songs.length > 0 && scrollHeight - scrollPosition < 100){
            setShouldShowLoader(true);
            loadMoreSongs()
                .then(() => {
                    setShouldShowLoader(false);
                });
        }
    }, [scrollPosition]);

    // Play a song with index equal to the currentlyPlaying
    useEffect(() => {
        const playSong = () => {
            const songItem = songs[currentlyPlaying];
            if (songItem) {
                const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);

                if (videoIdMatch)
                    loadVideoById(videoIdMatch[1]);
                else
                    props.getYtItems(songItem.title)
                        .then(ytItems => {
                            loadVideoById(ytItems[0].videoId);
                        })
            }
        }

        if (typeof currentplyPlaying === 'number' && currentlyPlaying >= songs.length) {
                console.log(currentlyPlaying, songs.length)
                loadMoreSongs()
                    .then(playSong);
        } else {
            playSong();
        }
    }, [currentlyPlaying]);


    function pushNotification(text) {
        notification.open({
            message: 'Song list notification',
            description: text
        });
    }

    function reloadSongs() {
        setShouldShowLoader(true);
        getSongs().finally(() => {
            setShouldShowLoader(false);
            dispatch({ type: 'RESET' });
        });
    }

    // function initAutoplay() {
    //     props.ytPlayer.addEventListener('onStateChange', state => {
    //         console.log('STATE: ', state.data, loadingVideo);
    //         if (state.data === 1) {         // PLAYING
    //             loadingVideo = false;
    //         }
    //         else if (state.data === 3) {    // FETCHING DATA
    //             loadingVideo = true;
    //         }
    //         else if (state.data === -1 && loadingVideo) {   // INTERUPTED OR STH
    //             loadingVideo = false;
    //             const songItem = songs[currentlyPlaying];
    //             console.log('Currently: ', currentlyPlaying);
    //             props.getYtItems(songItem.title)
    //                 .then(ytItems => {
    //                     loadVideoById(ytItems[0].videoId);
    //                 });
    //         }
    //         else if (state.data === 0) {                // FINISHED
    //             dispatch({ type: 'PLAY_NEXT' });
    //         }
    //     });
    // }

    function loadVideoById(videoId) {
        props.ytPlayer.loadVideoById(videoId);
    }

    return (
        <div style={{ padding: 8 }}>
            <TagList
                toggleTag={(tagElement) => toggleTag(tagElement)}
                tags={tags}
                isVisible={isTagDrawerVisible}
                setIsVisible={(i) => setIsTagDrawerVisible(i)}
            />
            <NewSongModal 
                tags={tags}
                isVisible={isNewSongModalVisible}
                closeModal={() => setIsNewSongModalVisible(false)}
            />
            {editedSong && <EditSongModal
                tags={tags}
                isVisible={!!editedSong}
                closeModal={() => setEditedSong(null)}
                songItem={editedSong}
                updateSingleSong={s => updateSingleSong(s)}
            />}
            <SongFilterPanel
                songFilters={songFilters}
                setSongFilters={setSongFilters}
                showTagsDrawer={() => setIsTagDrawerVisible(true)}
                showNewSongModal={() => setIsNewSongModalVisible(true)}
            />
            <List
                rowKey="id"
                loading={shouldShowLoader}
                dataSource={songs}
                renderItem={(songItem, index) => {
                    const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : '';
                    return (
                        <List.Item
                            style={{paddingLeft: 8, paddingRight: 8}}
                            className={index === currentlyPlaying ? 'item-selected' : ''} 
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
                            <Row gutter={16}>
                                <Col>
                                    <Button type="primary"
                                        onClick={() => dispatch({ type: 'PLAY_BY_INDEX', songIndex: index})}
                                        title="Play song on this device">
                                            <i className="fas fa-play"></i>
                                    </Button>
                                </Col>
                                <Col>
                                    <SongInfoContainer
                                        songItem={songItem}
                                        tags={tags}
                                    />
                                </Col>
                            </Row>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => ({});

export const SongList = connect(mapStateToProps, mapDispatchToProps)(SongListX);
