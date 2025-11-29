import React, { useState } from 'react';
import { SongItem } from 'mellov_api';
import { Modal, Select, Input } from 'antd';
const { Option } = Select;

import { useTagsState } from './TagsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faMusic } from '@fortawesome/free-solid-svg-icons';

export function NewSongModal(props) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [songTags, setSongTags] = useState([]);
    const { tags, tagsNameToIdMap } = useTagsState();

    function handleUrlChange(event) {
        const url = event.target.value;
        const videoIdMatch = url.match(/[\\?&]v=([^&]*)/);
        if (videoIdMatch && videoIdMatch[1])
            setUrl('https://www.youtube.com/watch?v='+videoIdMatch[1]);
        else
            setUrl(url);
    }

    function addSong() {
        if (title.trim() === '') {
            console.warn('Title does not match criteria!');
            return;
        }
        const songTagsIds = songTags.map(tagName => tagsNameToIdMap[tagName])
            .filter(tagId => typeof tagId === 'string');

        const newSongItem = new SongItem();
        newSongItem.title = title.trim();
        newSongItem.url = url.trim();
        newSongItem.dateAdded = new Date().toISOString();
        newSongItem.tags = songTagsIds;

        props.addSong(newSongItem)
            .then(() => {
                setTitle('');
                setUrl('');
                setSongTags([]);
                props.closeModal();
            });
    }

    return (
        <Modal
            title="Add song"
            open={props.isOpen}
            onOk={addSong}
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
                value={songTags}
                onChange={setSongTags}
            >
                {tags.map(({tagItem}) => (
                    <Option key={tagItem.id} value={tagItem.name}>{tagItem.name}</Option>
                ))}
            </Select>
        </Modal>
    );
}
