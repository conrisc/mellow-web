import React, { useState } from 'react';
import { SongItem } from 'mellov_api';
import { Modal, Select, Input } from 'antd';
const { Option } = Select;

import { useTagsState } from './TagsContext';
import { createVideoLink } from 'Utils/yt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faMusic } from '@fortawesome/free-solid-svg-icons';

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
            setUrl(createVideoLink(videoIdMatch[1]));
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

        const updatedSongItem = new SongItem();
        updatedSongItem.id = songItem.id;
        updatedSongItem.title = title.trim();
        updatedSongItem.url = url.trim();
        updatedSongItem.dateAdded = songItem.dateAdded;
        updatedSongItem.tags = songTagsIds;


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
            open={props.isOpen}
            onOk={updateSong}
            onCancel={props.closeModal}
        >
            <Input
                style={{ margin: 8 }}
                prefix={<FontAwesomeIcon icon={faMusic} />}
                placeholder="Song title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Input
                style={{ margin: 8 }}
                prefix={<FontAwesomeIcon icon={faLink} />}
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
