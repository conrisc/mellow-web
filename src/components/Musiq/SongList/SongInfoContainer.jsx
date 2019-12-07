import React, { useState, useEffect } from 'react';
import { DevelopersApi, SongItem } from 'what_api';

export function SongInfoContainer(props) {
    const songItem = props.songItem;
    const [titleEditMode, setTitleEditMode] = useState(false);
    const [songTitle, setSongTitle] = useState(songItem.title);
    const [tagsEditMode, setTagsEditMode] = useState(false);
    const [songTags, setTags] = useState([]);
    const [editedTag, setEditedTag] = useState('');
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

    useEffect(() => {
        setTags(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));
        setSongTitle(songItem.title);
    }, [props.songItem]);

    function handleSongTitleChange(event) {
        setSongTitle(event.target.value);

    }

    function handleTitleInputKeyDown(event) {
        if (event.key === 'Enter') {
            updateTitle();
        }
    }

    function updateTitle() {
        setTitleEditMode(false);
        if (!songTitle) setSongTitle(songItem.title);
        else updateSong();
    }

    function updateSong() {
        const songTagsIds = songTags.map(tagName => tagsNameToIdMap[tagName])
            .filter(tagId => typeof tagId === 'string');
        const opts = {
            songItem: new SongItem(songTitle.trim(), songItem.url, songItem.dateAdded, songTagsIds)
        }
        opts.songItem.id = songItem.id;

        const api = new DevelopersApi();
        api.updateSong(opts)
            .then(result => {
                console.log('Song updated');
                props.updateSingleSong(result);
            })
            .catch(err => {
                setSongTitle(songItem.title);
                console.warn('Error while updating song: ', err);
            })
    }

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

    function toggleTagsEditMode() {
        if (tagsEditMode) {
            setTagsEditMode(false);
            updateSong();
        } else {
            setTagsEditMode(true);
        }
    }

    return (
        <div className="col">
            { titleEditMode ?
                <input type="text" value={songTitle} onChange={handleSongTitleChange} onKeyDown={handleTitleInputKeyDown} onBlur={updateTitle} /> :
                <h6 className="bold" onDoubleClick={() => setTitleEditMode(true)}>{songTitle}</h6>
            }
            <div className="row">
                <div className="col">
                    {
                        songTags.map((tagName, index) => <div key={index} className="tag-item">
                            {tagName}
                            {/* <i className="fas fa-times"></i> */}
                        </div>)
                    }
                </div>
                {
                    tagsEditMode &&
                    <div className="col">
                            <input className="input-small" type="text" value={editedTag} onChange={handleTagChange} onKeyDown={handleTagAction} />
                    </div>
                }
                <div className="col">
                    <button className="btn btn-small btn-simple btn-mini black-text" onClick={toggleTagsEditMode}>
                        <i className="far fa-edit"></i>
                    </button>
                </div>
            </div>
            <p>
                <span className="small-text grey-text">{date}</span>
            </p>
        </div>
    );
}
