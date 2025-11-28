import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { List, Row, Col, notification, Switch } from 'antd';

import { dataTypes } from 'Constants/wsConstants';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { SongFilterPanel } from './SongFilterPanel';
import { TagList } from './TagList';
import { EditSongModal } from './EditSongModal';
import { TagsProvider, useTagsState } from './TagsContext';

import { useScroll } from 'Hooks/useScroll';
import { useSongs } from 'Hooks/useSongs';
import { PlayerStatus, usePlayerStatus } from 'Hooks/usePlayerStatus';
import { createVideoLink } from 'Utils/yt';
import { SongItem } from 'mellov_api';
import { SongFilters } from 'Types/song.types';
import { usePlayer } from 'Contexts/PlayerContext';

import './SongList.css';
import { useAudioPlayerStatus } from 'Hooks/useAudioPlayerStatus';
import { SongListUrlBanner } from './SongListUrlBanner';
import { SongListItem } from './SongListItem';
import { useSongPlayer } from 'Hooks/useSongPlayer';

function switchSong({ currentlyPlaying }, action) {
	switch (action.type) {
		case 'PLAY_PREVIOUS':
			console.log('switchSong: Play previous');
			if (currentlyPlaying > 0) return { currentlyPlaying: currentlyPlaying - 1 };
			break;
		case 'PLAY_NEXT':
			console.log('switchSong: Play next');
			return {
				currentlyPlaying: currentlyPlaying === null ? 0 : currentlyPlaying + 1,
			};
		case 'PLAY_BY_INDEX':
			console.log('switchSong: Play by index: ', action.songIndex);
			return {
				currentlyPlaying: isNaN(action.songIndex) ? null : action.songIndex,
			};
		case 'RESET':
			console.log('switchSong: Reset');
			return {
				currentlyPlaying: null,
			};
		default:
			throw new Error(`switchSong: Action ${action.type} is not recognizable`);
	}
}

// TODO:
// update currentlyPlaying after removing/adding a new song
// onClick "Play" for the current song (it should try to replay that song (maybe, im not sure yet))
// reload songs only on tag selection change

function SongListX(props) {
	const { ytPlayer, audioPlayer, playerType, setPlayerType } = usePlayer();

	const { status: playerStatus, videoData } =
		playerType === 'audio' ? useAudioPlayerStatus(audioPlayer) : usePlayerStatus(ytPlayer);
	const { tags } = useTagsState();
	const [songFilters, setSongFilters] = useState<SongFilters>({
		title: '',
		skip: 0,
		limit: 30,
		sort: 'added_date_desc',
	});

	const { songs, getSongs, loadMoreSongs, addSong, updateSong, removeSong } = useSongs(
		tags,
		songFilters
	);
	const [isLoadingSongs, setIsLoadingSongs] = useState(true);
	const [{ currentlyPlaying }, dispatch] = useReducer(switchSong, { currentlyPlaying: null });
	const [isTagDrawerOpen, setIsTagDrawerOpen] = useState(false);
	const [editedSong, setEditedSong] = useState<SongItem | null>(null);
	const { scrollPosition, scrollHeight } = useScroll();
	const songsReloaderRef = useRef(null);
	const hasMoreSongs = useRef(true);
	const [urlBannerHidden, setUrlBannerHidden] = useState(false);

	const handlePlayNext = useCallback(() => {
		dispatch({ type: 'PLAY_NEXT' });
	}, []);

	const { playSong, handleSongClick, getIconForCurrentSong } = useSongPlayer({
		songs,
		currentlyPlaying,
		playerType,
		audioPlayer,
		ytPlayer,
		playerStatus,
		getYtItems: props.getYtItems,
		onPlayNext: handlePlayNext,
	});

	useEffect(() => {
		const webSocket = musiqWebsocket.getInstance();
		const wsListeners = {
			message: (message) => {
				const dataFromServer = JSON.parse(message.data);
				switch (dataFromServer.type) {
					case dataTypes.NEXT_SONG:
						dispatch({ type: 'PLAY_NEXT' });
						pushNotification('Play next song');
						break;
					case dataTypes.PREV_SONG:
						dispatch({ type: 'PLAY_PREVIOUS' });
						pushNotification('Play previous song');
						break;
				}
			},
		};
		webSocket.addListeners(wsListeners);
	}, []);

	// Refetch songs without a delay
	useEffect(() => {
		clearTimeout(songsReloaderRef.current);
		reloadSongs();
	}, [songFilters.limit, songFilters.sort]);

	// Refetch songs with a delay (debounced)
	useEffect(() => {
		songsReloaderRef.current = setTimeout(reloadSongs, 800);

		return () => {
			clearTimeout(songsReloaderRef.current);
		};
	}, [tags, songFilters.skip, songFilters.title]);

	// Load more songs on scroll to bottom
	useEffect(() => {
		if (props.isActive && songs.length > 0 && scrollHeight - scrollPosition < 100) {
			loadMore();
		}
	}, [scrollPosition]);

	// Play a song with index equal to the currentlyPlaying
	useEffect(() => {
		if (typeof currentlyPlaying === 'number' && currentlyPlaying === songs.length - 1) {
			loadMore();
		}

		playSong();
		setUrlBannerHidden(false);
	}, [currentlyPlaying]);

	function pushNotification(text: string): void {
		notification.open({
			message: 'Song list notification',
			description: text,
		});
	}

	function reloadSongs(): void {
		document.documentElement.scrollTo(0, 0);
		setIsLoadingSongs(true);
		getSongs().finally(() => {
			hasMoreSongs.current = true;
			setIsLoadingSongs(false);
			dispatch({ type: 'RESET' });
		});
	}

	function loadMore(): Promise<void> {
		if (!hasMoreSongs.current || isLoadingSongs) return Promise.resolve();

		setIsLoadingSongs(true);
		return loadMoreSongs().then(({ fetched }) => {
			if (fetched === 0) hasMoreSongs.current = false;
			setIsLoadingSongs(false);
		});
	}

	function onSongClick(songIndex: number): void {
		handleSongClick(songIndex);
		if (songIndex !== currentlyPlaying) {
			dispatch({ type: 'PLAY_BY_INDEX', songIndex });
		}
	}

	function shouldShowUrlBanner(): boolean {
		const songItem = songs[currentlyPlaying];
		return !!(
			!urlBannerHidden &&
			playerStatus !== PlayerStatus.FAILED &&
			songItem &&
			!songItem.url &&
			videoData?.videoId
		);
	}

	function updateSongUrl(videoId: string): void {
		const songItem = songs[currentlyPlaying];
		if (!songItem) return;

		const updatedSongItem = new SongItem();
		updatedSongItem.id = songItem.id;
		updatedSongItem.title = songItem.title;
		updatedSongItem.url = createVideoLink(videoId);
		updatedSongItem.dateAdded = songItem.dateAdded;
		updatedSongItem.tags = songItem.tags.slice();

		updateSong(updatedSongItem).catch((error) => {
			console.warn(`Failed to update song's url. Error: ${error?.message}`);
		});
	}

	return (
		<Row>
			<Col xs={0} lg={6}>
				<TagList isOpen={isTagDrawerOpen} setIsOpen={(i) => setIsTagDrawerOpen(i)} />
			</Col>
			<Col xs={24} lg={18}>
				{editedSong && (
					<EditSongModal
						isOpen={!!editedSong}
						closeModal={() => setEditedSong(null)}
						songItem={editedSong}
						updateSong={updateSong}
					/>
				)}
				<div className="songs-toolbar">
					<div style={{ textAlign: 'right', marginTop: '8px', marginRight: '16px' }}>
						<Switch
							checked={playerType === 'yt'}
							onChange={(checked) => setPlayerType(checked ? 'yt' : 'audio')}
							checkedChildren="YT"
							unCheckedChildren="Audio"
						/>
					</div>
					<SongFilterPanel
						addSong={addSong}
						songFilters={songFilters}
						setSongFilters={setSongFilters}
						showTagsDrawer={() => setIsTagDrawerOpen(true)}
					/>
					{shouldShowUrlBanner() && (
						<SongListUrlBanner
							songTitle={songs[currentlyPlaying].title}
							videoData={videoData}
							onUpdate={updateSongUrl}
							onDismiss={() => setUrlBannerHidden(true)}
						/>
					)}
				</div>
				<List
					className="song-list"
					rowKey="id"
					size="small"
					loading={isLoadingSongs}
					dataSource={songs}
					renderItem={(songItem, index) => (
						<SongListItem
							key={songItem.id}
							songItem={songItem}
							index={index}
							isPlaying={index === currentlyPlaying}
							playIcon={getIconForCurrentSong()}
							onSongClick={onSongClick}
							editSong={setEditedSong}
							removeSong={removeSong}
							getYtItems={props.getYtItems}
							showYtTab={props.showYtTab}
							loadVideo={props.loadVideo}
						/>
					)}
				/>
			</Col>
		</Row>
	);
}

export function SongList(props) {
	return (
		<TagsProvider>
			<SongListX {...props} />
		</TagsProvider>
	);
}
