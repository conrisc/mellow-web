import React from 'react';
import { Input, List, Row, Col, Button, Space } from 'antd';

import { YtPlayer } from './YtPlayer';
import { Spinner } from 'CommonComponents/Spinner';
import { createVideoLink } from 'Utils/yt';
import { AudioPlayer } from './AudioPlayer';
import { usePlayer } from 'Contexts/PlayerContext';
import { YTItem } from 'Types/youtube.types';

interface YtListProps {
	ytItems: YTItem[];
	isFetchingYtItems: boolean;
	getYtItemsDebounced: (title: string) => void;
	loadVideo: (videoId: string) => void;
}

export function YtList({ ytItems, isFetchingYtItems, getYtItemsDebounced, loadVideo }: YtListProps) {
	const { ytPlayer } = usePlayer();

	function loadVideoById(videoId: string) {
		ytPlayer?.loadVideoById(videoId);
	}

	function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		const title = event.target.value;
		getYtItemsDebounced(title);
	}

	return (
		<div className="yt-list side-bar">
			<YtPlayer />
			<AudioPlayer />
			<div style={{ padding: 12 }}>
				<Input
					className="yt-search"
					allowClear={true}
					onChange={handleSearchChange}
					prefix={<i className="fas fa-search"></i>}
					placeholder="Search youtube"
				/>
				{isFetchingYtItems ? (
					<Spinner center={true} padding={16} />
				) : (
					<List
						rowKey="videoId"
						size="small"
						dataSource={ytItems}
						renderItem={(el) => (
							<List.Item
								className="f-size-medium"
								style={{ borderBottom: '1px solid #555959' }}
							>
								<Row justify="space-between" style={{ width: '100%', flexWrap: 'nowrap' }}>
									<Col flex="1 1 auto" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
										<a
											href={createVideoLink(el.videoId)}
											target="_blank"
											rel="noopener noreferrer"
											title="Open song in youtube"
										>
											<h4
												style={{
													color: '#ececec',
													marginRight: '1em',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{el.title}
											</h4>
										</a>
										<Space className="mt-1">
											<Button onClick={() => loadVideo(el.videoId)}>
												<i className="fas fa-tv"></i>
											</Button>
											<Button type="primary" onClick={() => loadVideoById(el.videoId)}>
												<i className="fas fa-play"></i>
											</Button>
										</Space>
									</Col>
									<Col className="yt-image">
										<img src={`https://i.ytimg.com/vi/${el.videoId}/default.jpg`}></img>
										{/* <img src={el.thumbnailUrl}></img> */}
									</Col>
								</Row>
							</List.Item>
						)}
					/>
				)}
			</div>
		</div>
	);
}
