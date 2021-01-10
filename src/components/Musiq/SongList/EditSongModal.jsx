import React, { useState } from 'react';
import { SongItem } from 'what_api';
import { Modal, Select, Input } from 'antd';
const { Option } = Select;

import { useTagsState } from './TagsContext';

export function EditSongModal(props) {
    const { songItem } = props;
    const { tags, tagsNameToIdMap, tagsIdToNameMap } = useTagsState();

    const [title, setTitle] = useState(songItem.title);
    const [url, setUrl] = useState(songItem.url);
    const [songTags, setSongTags] = useState(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));

    function handleUrlChange(event) {
        const url = event.target.value;
        const videoIdMatch = url.match(/[\\?&]v=([^&]*)/);
        if (videoIdMatch && videoIdMatch[1])
            setUrl('https://www.youtube.com/watch?v='+videoIdMatch[1]);
        else
            setUrl(url);
	}

    function updateSong() {
        if (title.trim() === '') {
            console.warn('Title does not match criteria!');
            return;
        }
        const songTagsIds = songTags.map(tagName => tagsNameToIdMap[tagName])
            .filter(tagId => typeof tagId === 'string');

        const updatedSongItem = new SongItem(title.trim(), url.trim(), songItem.dateAdded, songTagsIds);
        updatedSongItem.id = songItem.id;

        props.updateSong(updatedSongItem)
            .catch(() => {
				setTitle(songItem.title);
				setUrl(songItem.url);
				setSongTags(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));
			});

		props.closeModal();
    }


    return (
        <Modal
            title="Edit song"
            visible={props.isVisible}
            onOk={updateSong}
            onCancel={props.closeModal}
        >
            <Input
                style={{ margin: 8 }}
                prefix={<i className="fas fa-music prefix"></i>}
                placeholder="Song title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Input
                style={{ margin: 8 }}
                prefix={<i className="fas fa-link prefix"></i>}
                placeholder="Song url"
                value={url}
                onChange={handleUrlChange}
            />
            <Select
                style={{ width: '100%', margin: 8 }}
                mode="multiple"
                placeholder="Song tags"
                onChange={setSongTags}
                defaultValue={songTags}
            >
                {tags.map(({tagItem}) => (
                    <Option key={tagItem.id} value={tagItem.name}>{tagItem.name}</Option>
                ))}
            </Select>
        </Modal>
    );
}
