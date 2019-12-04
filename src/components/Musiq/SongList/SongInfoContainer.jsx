import React, { useState, useEffect } from 'react';
import { DevelopersApi, SongItem } from 'what_api';

export function SongInfoContainer(props) {
    const songItem = props.songItem;
    const [titleEditMode, setTitleEditMode] = useState(false);
    const [songTitle, setSongTitle] = useState(songItem.title);
    const date = new Date(songItem.dateAdded).toGMTString();

    const tagsIdToNameMap = props.tags.reduce(
        (acc, tagElement) => { 
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        }, 
    {});
    const tagsNameToIdMap = props.tags.reduce(
        (acc, tagElement) => {
            acc[tagElement.tagItem.name] = tagElement.tagItem.id;
            return acc;
        },
    {});
    const [tagsEditMode, setTagsEditMode] = useState(false);
    const [tags, setTags] = useState(songItem.tags.map(tagId => tagsIdToNameMap[tagId])); // updateTags when props.tags changes
    const [editedTag, setEditedTag] = useState('');

    function handleSongTitleChange(event) {
        setSongTitle(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            updateTitle();
        }
    }

    function updateTitle() {
        setTitleEditMode(false);

        if (songTitle === '' || songTitle === songItem.title) return;

        const opts = {
            songItem: new SongItem(songTitle, songItem.url, songItem.dateAdded, songItem.tags) // updateTags
        }
        opts.songItem.id = songItem.id;

        const api = new DevelopersApi();
        api.updateSong(opts)
            .then(() => {
                console.log('Song updated');
                // TODO - update state.songs in SongList component
            })
            .catch((err) => {
                console.warn('Error while updating song: ', err);
            })
    }

    function updateTags() {
        if (songTitle === '') return;
        const tagsIds = tags.map(tagName => tagsNameToIdMap[tagName])
            .filter(tagId => typeof tagId === 'string');
        const opts = {
            songItem: new SongItem(songTitle, songItem.url, songItem.dateAdded, tagsIds)
        }
        opts.songItem.id = songItem.id;

        const api = new DevelopersApi();
        api.updateSong(opts)
            .then(() => {
                console.log('Song updated');
            })
            .catch((err) => {
                console.warn('Error while updating song: ', err);
            })
    }

    function handleTagChange(event) {
        const value = event.target.value;
        setEditedTag(value);
    }

    function handleTagAction(event) {
        switch(event.key) {
            case 'Enter':
                if (editedTag !== '') {
                    setTags([...tags, editedTag]);
                    setEditedTag('');
                }
                break;
            case 'Backspace':
                if (editedTag === '') {
                    setEditedTag(tags[tags.length-1]);
                    setTags(tags.slice(0,-1));
                    event.preventDefault();
                }
                break;
        }
    }

    function toggleTagsEditMode() {
        if (tagsEditMode) {
            setTagsEditMode(false);
            updateTags();
        } else {
            setTagsEditMode(true);
        }
    }

    return (
        <div className="col">
            { titleEditMode ?
                <input type="text" value={songTitle} onChange={handleSongTitleChange} onKeyDown={handleKeyDown} onBlur={updateTitle} /> :
                <h6 className="bold" onDoubleClick={() => setTitleEditMode(true)}>{songTitle}</h6>
            }
            {
                tags.map((tagName, index) => <div key={index} className="tag-item">
                    {tagName}
                    {/* <i className="fas fa-times"></i> */}
                </div>)
            }
            {
                tagsEditMode &&
                <input type="text" value={editedTag} onChange={handleTagChange} onKeyDown={handleTagAction} />
            }
            <button className="btn btn-small" onClick={toggleTagsEditMode}>
                <i className="far fa-edit"></i>
            </button>
            <p>
                <span className="small-text grey-text">{date}</span>
            </p>
        </div>
    );
}
