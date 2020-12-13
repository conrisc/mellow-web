import React, { useState, useEffect } from 'react';
import { Tag, Tooltip } from 'antd';

export function SongInfoContainer(props) {
    const { songItem, tags } = props;
    const [songTags, setTags] = useState([]);
    const dateAdded = new Date(songItem.dateAdded).toLocaleDateString();

    const tagsIdToNameMap = tags.reduce(
        (acc, tagElement) => { 
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        }, 
    {});

    useEffect(() => {
        setTags(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));
    }, [props.songItem]);


    return (
        <>
            <h3 className="bold">{songItem.title}</h3>
            <div>
                {songTags.map((tagName, index) =>
                    <Tag key={index} color="green">
                        {tagName}
                    </Tag>)
                }
            </div>
            <Tooltip title="Date added" placement="bottom">
                <span className="small-text grey-text">{dateAdded}</span>
            </Tooltip>
        </>
    );
}
