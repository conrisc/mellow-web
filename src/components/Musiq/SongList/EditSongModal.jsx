import React, {useEffect, useState} from 'react';
import {UsersApi, SongItem} from 'what_api';
import { Modal, Row, Col, Input } from 'antd';

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
    const [editedTag, setEditedTag] = useState('');


    function handleTagChange(event) {
        const value = event.target.value;
        setEditedTag(value);
    }

    function handleTagAction(event) {
        switch(event.key) {
            case ' ':
            case 'Enter':
                if (editedTag.trim() !== '') {
                    setTags([...songTags, editedTag.trim()]);
                    setEditedTag('');
                    event.preventDefault();
                }
                break;
            case 'Backspace':
                if (editedTag === '') {
                    setEditedTag(songTags[songTags.length-1]);
                    setTags(songTags.slice(0,-1));
                    event.preventDefault();
                }
                break;
        }
    }

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
            <Row>
                <Col span={12}>
                    <i className="fas fa-music prefix"></i>
                    <Input value={title} onChange={e => setTitle(e.target.value)} />
                </Col>
                <Col span={12}>
                    <i className="fas fa-link prefix"></i>
                    <Input value={url} onChange={handleUrlChange} />
                </Col>
            </Row>
            <Row>
                <Col>
                    {songTags.map((tagName, index) =>
                        <div key={index} className="tag-item">
                            {tagName}
                            {/* <i className="fas fa-times"></i> */}
                        </div>)
                    }
                </Col>
                <Col>
                    <Input value={editedTag} onChange={handleTagChange} onKeyDown={handleTagAction} />
                </Col>
            </Row>
        </Modal>
    );
}
