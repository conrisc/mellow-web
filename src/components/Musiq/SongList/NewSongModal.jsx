import React, {useEffect, useState} from 'react';
import {UsersApi, SongItem} from 'what_api';
import { Modal } from 'antd';

export function NewSongModal(props) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [songTags, setTags] = useState(['new']);
    const [editedTag, setEditedTag] = useState('');

    const tagsNameToIdMap = props.tags.reduce(
        (acc, tagElement) => {
            acc[tagElement.tagItem.name] = tagElement.tagItem.id;
            return acc;
        },
    {});

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

    function addSong() {
        if (title.trim() === '') {
            console.warn('Title does not match criteria!');
            return;
        }
        const songTagsIds = songTags.map(tagName => tagsNameToIdMap[tagName])
            .filter(tagId => typeof tagId === 'string');

        const opts = {
            songItem: new SongItem(title.trim(), url.trim(), new Date().toISOString(), songTagsIds)
        }

        const api = new UsersApi();
        api.addSong(opts)
            .then(data => {
                setTitle('');
                setUrl('');
                console.log('API called successfully.', data);
            }, error => {
                console.error(error);
            });

        props.closeModal();
    }

    function handleUrlChange(event) {
        const url = event.target.value;
        const videoIdMatch = url.match(/[\\?&]v=([^&]*)/);
        if (videoIdMatch && videoIdMatch[1])
            setUrl('https://www.youtube.com/watch?v='+videoIdMatch[1]);
        else
            setUrl(url);
    }

    return (
        <Modal
            title="Add song"
            visible={props.isVisible}
            onOk={addSong}
            onCancel={props.closeModal}
        >
            <div className="row">
                <div className="col s6 input-field">
                    <i className="fas fa-music prefix"></i>
                    <input id="addSongTitle" type="text" className="validate" value={title} onChange={e => setTitle(e.target.value)} />
                    <label htmlFor="addSongTitle">Song title</label>
                </div>
                <div className="col s6 input-field">
                    <i className="fas fa-link prefix"></i>
                    <input id="addSongUrl" type="text" className="validate" value={url} onChange={handleUrlChange} />
                    <label htmlFor="addSongUrl">Song url</label>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {songTags.map((tagName, index) =>
                        <div key={index} className="tag-item">
                            {tagName}
                            {/* <i className="fas fa-times"></i> */}
                        </div>)
                    }
                </div>
                <div className="col">
                    <input className="input-small" type="text" value={editedTag} onChange={handleTagChange} onKeyDown={handleTagAction} />
                </div>
            </div>
        </Modal>
    );
}
