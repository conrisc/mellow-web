import React from 'react';

export function SongInfoContainer(props) {
    const songItem = props.songItem;
    const date = new Date(songItem.dateAdded).toGMTString();
    const tagsIdToNameMap = props.tags.reduce(
        (acc, tagElement) => { 
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        }, 
    {});

    return (
        <div className="col">
            <h6 className="bold">{songItem.title}</h6>
            {
                songItem.tags.map(tagId => <span key={tagId} className="tag-item">{tagsIdToNameMap[tagId]}</span>)
            }
            <p>
                <span className="small-text grey-text">{date}</span>
            </p>
        </div>
    );
}
