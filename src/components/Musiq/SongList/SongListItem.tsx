import React, { ReactElement } from 'react';
import { List, Row, Col } from 'antd';
import { SongItem } from 'mellov_api';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';

interface SongListItemProps {
	songItem: SongItem;
	index: number;
	isPlaying: boolean;
	playIcon: ReactElement;
	onSongClick: (index: number) => void;
	editSong: (song: SongItem) => void;
	removeSong: (id: string) => void;
	getYtItems: (title: string) => Promise<any[]>;
	showYtTab: () => void;
	loadVideo: (videoId: string) => void;
}

export const SongListItem = React.memo(function SongListItem({
	songItem,
	index,
	isPlaying,
	playIcon,
	onSongClick,
	editSong,
	removeSong,
	getYtItems,
	showYtTab,
	loadVideo,
}: SongListItemProps) {
	const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
	const videoId = videoIdMatch ? videoIdMatch[1] : '';

	return (
		<List.Item
			onClick={() => onSongClick(index)}
			className={'song-item f-size-medium' + (isPlaying ? ' selected-song' : '')}
			extra={
				<SongActionButtons
					songItem={songItem}
					videoId={videoId}
					getYtItems={getYtItems}
					showYtTab={showYtTab}
					loadVideo={loadVideo}
					editSong={() => editSong(songItem)}
					removeSong={(id) => removeSong(id)}
				/>
			}
		>
			<Row gutter={16} style={{ flexWrap: 'nowrap' }}>
				<Col className="status-indicator">
					{isPlaying ? (
						<div>{playIcon}</div>
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
});
