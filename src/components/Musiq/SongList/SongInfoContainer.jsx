import React, { useState, useEffect } from 'react';
import { Tag, Tooltip } from 'antd';

import { useTagsState } from './TagsContext';

import './SongInfoContainer.css';

export function SongInfoContainer(props) {
	const { songItem } = props;
	const [songTags, setTags] = useState([]);
	const dateAdded = new Date(songItem.dateAdded).toLocaleDateString();
	const { tagsIdToNameMap } = useTagsState();
	const trackUri = songItem.metadata.trackUri?.split(':')[2];

	useEffect(() => {
		setTags(songItem.tags.map((tagId) => tagsIdToNameMap[tagId]));
	}, [props.songItem]);

	const openTrackUri = (event) => {
		event.stopPropagation();
		window.open(`https://open.spotify.com/track/${trackUri}`, '_blank');
	};

	const openSearchTrack = (event) => {
		event.stopPropagation();
		const url = `https://open.spotify.com/search/${songItem.title}`;
		window.open(url, '_blank');
	};

	return (
		<>
			<div className={'song-title' + (!trackUri ? ' no-uri' : '')}>{songItem.title}</div>
			<div>
				{songTags.map((tagName, index) => (
					<Tag key={index} color="geekblue">
						{tagName}
					</Tag>
				))}
			</div>
			{trackUri ? (
				<div className="track-tag" onClick={(e) => openTrackUri(e)}>
					<Tooltip
						title={'Matched at: ' + songItem.metadata.matchedByScriptAt}
						placement="bottom"
					>
						{trackUri}
					</Tooltip>
				</div>
			) : (
				<div className="track-tag tag-blue" onClick={(e) => openSearchTrack(e)}>
					Search
				</div>
			)}
			<Tooltip title="Date added" placement="bottom">
				<span className="small-text grey-text">{dateAdded}</span>
			</Tooltip>
		</>
	);
}
