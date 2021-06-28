import React, { useState, useEffect } from 'react';
import { Tag, Tooltip } from 'antd';

import { useTagsState } from './TagsContext';

export function SongInfoContainer(props) {
    const { songItem, } = props;
    const [songTags, setTags] = useState([]);
    const dateAdded = new Date(songItem.dateAdded).toLocaleDateString();
    const { tagsIdToNameMap } = useTagsState();

    useEffect(() => {
        setTags(songItem.tags.map(tagId => tagsIdToNameMap[tagId]));
    }, [props.songItem]);


    return (
        <>
            <h4 className="bold">{songItem.title}</h4>
            <div>
                {songTags.map((tagName, index) =>
                    <Tag key={index} color="geekblue">
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
