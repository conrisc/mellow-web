import React, { useState } from 'react';
import { DevelopersApi, SongItem } from 'what_api';

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
            updateTitle();
        }
    }

    function updateTitle() {
        setTitleEditMode(false);

        if (songTitle === '' || songTitle === songItem.title) return;

        const opts = {
            songItem: new SongItem(songTitle, songItem.url, songItem.dateAdded, songItem.tags)
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

    return (
        <div className="col">
            { titleEditMode ?
                <input type="text" value={songTitle} onChange={handleSongTitleChange} onKeyDown={handleKeyDown} onBlur={updateTitle} /> :
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
