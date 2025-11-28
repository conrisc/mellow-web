import React from 'react';
import { Alert, Space, Button } from 'antd';

interface VideoData {
	videoId: string;
	title: string;
}

interface SongListUrlBannerProps {
	songTitle: string;
	videoData: VideoData;
	onUpdate: (videoId: string) => void;
	onDismiss: () => void;
}

export function SongListUrlBanner({
	songTitle,
	videoData,
	onUpdate,
	onDismiss,
}: SongListUrlBannerProps) {
	return (
		<Alert
			message={
				<span>
					Add missing url to <b>{songTitle}</b> ?
					<br />
					Playing: <b>{videoData.title}</b> ({videoData.videoId})
				</span>
			}
			type="info"
			banner
			action={
				<Space>
					<Button size="small" type="primary" onClick={() => onUpdate(videoData.videoId)}>
						Yes
					</Button>
					<Button size="small" danger onClick={onDismiss}>
						No
					</Button>
				</Space>
			}
		/>
	);
}
