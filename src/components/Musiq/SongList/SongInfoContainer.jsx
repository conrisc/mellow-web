import React, { useState } from 'react';

export function SongInfoContainer(props) {
    const [titleEditMode, setTitleEditMode] = useState(false);
    const songItem = props.songItem;
    const [songTitle, setSongTitle] = useState(songItem.title);
    const date = new Date(songItem.dateAdded).toGMTString();
    const tagsIdToNameMap = props.tags.reduce(
        (acc, tagElement) => { 
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        }, 
    {});

    function handleSongTitleChange(event) {
        setSongTitle(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            setTitleEditMode(false);
        }
    }

    return (
        <div className="col">
            { titleEditMode ?
                <input type="text" value={songTitle} onChange={handleSongTitleChange} onKeyDown={handleKeyDown} onBlur={() => setTitleEditMode(false)} /> :
                <h6 className="bold" onDoubleClick={() => setTitleEditMode(true)}>{songTitle}</h6>
            }
            {
                songItem.tags.map(tagId => <span key={tagId} className="tag-item">{tagsIdToNameMap[tagId]}</span>)
            }
            <p>
                <span className="small-text grey-text">{date}</span>
            </p>
        </div>
    );
}
