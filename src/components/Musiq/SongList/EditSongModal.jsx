import React, { useState } from 'react';
import {UsersApi, SongItem} from 'what_api';
import { Modal, Select, Input } from 'antd';
const { Option } = Select;

export function EditSongModal(props) {
	const { songItem, tags } = props;

    const tagsNameToIdMap = tags.reduce(
        (acc, tagElement) => {
            acc[tagElement.tagItem.name] = tagElement.tagItem.id;
            return acc;
        },
	{});

    const tagsIdToNameMap = tags.reduce(
        (acc, tagElement) => {
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        },
	{});

    const [title, setTitle] = useState(songItem.title);
    const [url, setUrl] = useState(songItem.url);
    const [songTags, setTags] = useState(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));

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
        const opts = {
            songItem: new SongItem(title.trim(), url.trim(), songItem.dateAdded, songTagsIds)
        }
        opts.songItem.id = songItem.id;

        const api = new UsersApi();
        api.updateSong(opts)
            .then(result => {
                console.log('Song updated');
                props.updateSingleSong(result);
            })
            .catch(err => {
				setTitle(songItem.title);
				setUrl(songItem.url);
				setTags(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));
                console.warn('Error while updating song: ', err);
			})

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
                onChange={setTags}
                defaultValue={songTags}
            >
                {tags.map(({tagItem}) => (
                    <Option key={tagItem.id} value={tagItem.name}>{tagItem.name}</Option>
                ))}
            </Select>
        </Modal>
    );
}
