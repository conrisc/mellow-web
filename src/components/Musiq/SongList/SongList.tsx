import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { List, Row, Col, Switch } from 'antd';

import { SongFilterPanel } from './SongFilterPanel';
import { TagList } from './TagList';
import { EditSongModal } from './EditSongModal';
import { TagsProvider, useTagsState } from './TagsContext';
import { SongListItem } from './SongListItem';
import { SongListUrlBanner } from './SongListUrlBanner';

import { useScroll } from 'Hooks/useScroll';
import { useSongs } from 'Hooks/useSongs';
import { PlayerStatus, usePlayerStatus } from 'Hooks/usePlayerStatus';
import { useAudioPlayerStatus } from 'Hooks/useAudioPlayerStatus';
import { useSongPlayer } from 'Hooks/useSongPlayer';
import { useWebSocketControls } from 'Hooks/useWebSocketControls';
import { useInfiniteScroll } from 'Hooks/useInfiniteScroll';
import { useSongAutoload } from 'Hooks/useSongAutoload';
import { createVideoLink } from 'Utils/yt';
import { SongItem } from 'mellov_api';
import { SongFilters } from 'Types/song.types';
import { usePlayer } from 'Contexts/PlayerContext';

import './SongList.css';

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

	// Conditionally use the appropriate player hook based on playerType
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
	const isLoadingSongsRef = useRef(isLoadingSongs);

	// Keep ref in sync with state
	useEffect(() => {
		isLoadingSongsRef.current = isLoadingSongs;
	}, [isLoadingSongs]);

	// Memoize callbacks
	const handlePlayNext = useCallback(() => {
		dispatch({ type: 'PLAY_NEXT' });
	}, []);

	const handlePlayPrevious = useCallback(() => {
		dispatch({ type: 'PLAY_PREVIOUS' });
	}, []);

	const loadMore = useCallback((): Promise<void> => {
		if (!hasMoreSongs.current || isLoadingSongsRef.current) return Promise.resolve();

		setIsLoadingSongs(true);
		return loadMoreSongs().then(({ fetched }) => {
			if (fetched === 0) hasMoreSongs.current = false;
			setIsLoadingSongs(false);
		});
	}, [loadMoreSongs]);

	const reloadSongs = useCallback((): void => {
		document.documentElement.scrollTo(0, 0);
		setIsLoadingSongs(true);
		getSongs().finally(() => {
			hasMoreSongs.current = true;
			setIsLoadingSongs(false);
			dispatch({ type: 'RESET' });
		});
	}, [getSongs]);

	// Custom hooks for extracted functionality
	const { playSong, handleSongClick, getIconForCurrentSong, urlBannerHidden, setUrlBannerHidden } =
		useSongPlayer({
			songs,
			currentlyPlaying,
			playerType,
			audioPlayer,
			ytPlayer,
			playerStatus,
			getYtItems: props.getYtItems,
			onPlayNext: handlePlayNext,
			loadMore,
		});

	useWebSocketControls({
		onPlayNext: handlePlayNext,
		onPlayPrevious: handlePlayPrevious,
	});

	useInfiniteScroll({
		isActive: props.isActive,
		songsCount: songs.length,
		scrollPosition,
		scrollHeight,
		onLoadMore: loadMore,
	});

	useSongAutoload({
		currentlyPlaying,
		playSong,
	});

	// Refetch songs without a delay
	useEffect(() => {
		clearTimeout(songsReloaderRef.current);
		reloadSongs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [songFilters.limit, songFilters.sort]);

	// Refetch songs with a delay (debounced)
	useEffect(() => {
		songsReloaderRef.current = setTimeout(reloadSongs, 800);

		return () => {
			clearTimeout(songsReloaderRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tags, songFilters.skip, songFilters.title]);

	const shouldShowUrlBanner = useCallback((): boolean => {
		const songItem = songs[currentlyPlaying];
		return !!(
			!urlBannerHidden &&
			playerStatus !== PlayerStatus.FAILED &&
			songItem &&
			!songItem.url &&
			videoData?.videoId
		);
	}, [songs, currentlyPlaying, urlBannerHidden, playerStatus, videoData]);

	const updateSongUrl = useCallback(
		(videoId: string): void => {
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
		},
		[songs, currentlyPlaying, updateSong]
	);

	const onSongClickWithDispatch = useCallback(
		(songIndex: number): void => {
			handleSongClick(songIndex);
			if (songIndex !== currentlyPlaying) {
				dispatch({ type: 'PLAY_BY_INDEX', songIndex });
			}
		},
		[handleSongClick, currentlyPlaying]
	);

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
							onSongClick={onSongClickWithDispatch}
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
