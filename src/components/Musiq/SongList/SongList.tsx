import React, { useState, useEffect, useReducer, useRef, useCallback, ReactElement } from 'react';
import { connect } from 'react-redux';
import { List, Row, Col, notification, Alert, Space, Button } from 'antd';
import { debounce } from 'throttle-debounce';

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
import { PlayerStatus, usePlayerStatus } from 'Hooks/usePlayerStatus';
import { createVideoLink } from 'Utils/yt';
import { SongItem } from 'mellov_api';

import './SongList.css';
import { useAudioPlayerStatus } from 'Hooks/useAudioPlayerStatus';

class CancelledActionError extends Error {
	constructor(message: string = 'Action cancelled') {
		super(message);
		this.name = 'CancelledActionError';
	}
}

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
	const { ytPlayer, audioPlayer } = props;
	// const { status: playerStatus, videoData } = usePlayerStatus(ytPlayer);
	const { status: playerStatus, videoData } = useAudioPlayerStatus(audioPlayer);
	const { tags } = useTagsState();
	const [songFilters, setSongFilters] = useState({
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
	const songLoaderRef = useRef(null);
	const songsReloaderRef = useRef(null);
	const hasMoreSongs = useRef(true);
	const allowedRetries = useRef(0);
	// const loadSongByVideoIdDebounced = useCallback(
	// 	debounce(500, (videoId: string, title: string = '') => {
	// 		console.log('%cPlayer:', 'background-color: yellow', videoId, '|', title);
	// 		ytPlayer.loadVideoById(videoId);
	// 	}),
	// 	[ytPlayer]
	// );
	const loadSongByVideoIdDebounced = useCallback(
		debounce(500, (videoId: string, title: string = '') => {
			console.log('%cPlayer:', 'background-color: yellow', videoId, '|', title);
			audioPlayer.loadAudioByVideoId(videoId);
		}),
		[audioPlayer]
	);
	const [urlBannerHidden, setUrlBannerHidden] = useState(false);

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

	// Handle player's status change
	useEffect(() => {
		switch (playerStatus) {
			case PlayerStatus.FAILED:
				if (allowedRetries.current > 0) {
					if (allowedRetries.current === 1) playSong(true, 1);
					else playSong(true);

					allowedRetries.current--;
				}
				break;
			case PlayerStatus.ENDED:
				dispatch({ type: 'PLAY_NEXT' });
				break;
			case PlayerStatus.LOADING:
				audioPlayer.element.play(); // autoplay after loading starts
				break;
		}
	}, [playerStatus]);

	// Play a song with index equal to the currentlyPlaying
	useEffect(() => {
		if (typeof currentlyPlaying === 'number' && currentlyPlaying === songs.length - 1) {
			loadMore();
		}

		allowedRetries.current = 3;
		playSong();
		setUrlBannerHidden(false);
	}, [currentlyPlaying]);

	async function playSong(fromYT = false, ytIndex = 0): Promise<void> {
		songLoaderRef.current?.cancel();
		const songItem = songs[currentlyPlaying];
		if (songItem) {
			try {
				const videoId = await new Promise((resolve, reject) => {
					songLoaderRef.current = {
						cancel() {
							songLoaderRef.current = null;
							reject(new CancelledActionError());
						},
					};
					getSongVideoId(songItem, fromYT, ytIndex).then(resolve).catch(reject);
				});
				loadSongByVideoIdDebounced(videoId, songItem.title);
			} catch (error) {
				if (!(error instanceof CancelledActionError)) {
					console.warn(
						`Failed to get video id for the song: ${songItem.title}. Error: ${error.message}`
					);
					loadSongByVideoIdDebounced('fakeVideoId'); // workaround for retrying mechanism
				}
			}
		}
	}

	async function getSongVideoId(
		songItem: SongItem,
		fromYT: boolean,
		index: number
	): Promise<string> {
		const videoIdMatch = songItem.url.match(/[?&]v=([^&]*)/);

		if (videoIdMatch && !fromYT) return videoIdMatch[1];

		const ytItems = await props.getYtItems(songItem.title);
		if (ytItems.length > index) return ytItems[index].videoId;
		else
			throw Error(
				`Asked for ${index + 1} item on the list, but got only ${ytItems.length} items.`
			);
	}

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
		if (songIndex === currentlyPlaying) {
			switch (playerStatus) {
				case PlayerStatus.LOADED:
					ytPlayer.pauseVideo();
					audioPlayer.element.pause();
					break;
				case PlayerStatus.PAUSED:
				case PlayerStatus.ENDED:
					ytPlayer.playVideo();
					audioPlayer.element.play();
					break;
				case PlayerStatus.FAILED:
					playSong(true);
					break;
			}
		} else {
			ytPlayer.pauseVideo();
			audioPlayer.element.pause();
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

	function getIconForCurrentSong(): ReactElement {
		switch (playerStatus) {
			case PlayerStatus.PAUSED:
				return (
					<div>
						<i className="fas fa-pause-circle"></i>
					</div>
				);
			case PlayerStatus.ENDED:
				return (
					<div>
						<i className="fas fa-play-circle"></i>
					</div>
				);
			case PlayerStatus.FAILED:
				return (
					<p>
						<i className="fas fa-exclamation-circle"></i>
					</p>
				);
			case PlayerStatus.LOADING:
			case PlayerStatus.LOADED:
			default:
				return (
					<span>
						<i className="fas fa-compact-disc fa-spin"></i>
					</span>
				);
		}
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
					<SongFilterPanel
						addSong={addSong}
						songFilters={songFilters}
						setSongFilters={setSongFilters}
						showTagsDrawer={() => setIsTagDrawerOpen(true)}
					/>
					{shouldShowUrlBanner() && (
						<Alert
							message={
								<span>
									Add missing url to <b>{songs[currentlyPlaying].title}</b> ?
									<br />
									Playing: <b>{videoData.title}</b> ({videoData.videoId})
								</span>
							}
							type="info"
							banner
							action={
								<Space>
									<Button
										size="small"
										type="primary"
										onClick={() => updateSongUrl(videoData.videoId)}
									>
										Yes
									</Button>
									<Button
										size="small"
										danger
										onClick={() => setUrlBannerHidden(true)}
									>
										No
									</Button>
								</Space>
							}
						/>
					)}
				</div>
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
								className={
									'song-item f-size-medium' +
									(index === currentlyPlaying ? ' selected-song' : '')
								}
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
									<Col className="status-indicator">
										{index === currentlyPlaying ? (
											<div>{getIconForCurrentSong()}</div> // icon needs to be wrapped up so React could hold a reference to it
										) : (
											<span>
												<i className="fas fa-play-circle"></i>
											</span>
										)}
									</Col>
									<Col>
										<SongInfoContainer songItem={songItem} />
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

const mapStateToProps = (state) => ({
	ytPlayer: state.ytPlayer,
	audioPlayer: state.audioPlayer,
});

const mapDispatchToProps = (dispatch) => ({});

const SongListConnected = connect(mapStateToProps, mapDispatchToProps)(SongListX);

export function SongList(props) {
	return (
		<TagsProvider>
			<SongListConnected {...props} />
		</TagsProvider>
	);
}
