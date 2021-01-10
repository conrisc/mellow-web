import React, { useState } from 'react';
import { Drawer, List, Button, Input } from 'antd';

import { useTagsState, useTagsDispatch } from './TagsContext';

export function TagList(props) {
    const { isVisible, setIsVisible } = props;
    const { tags } = useTagsState();
    const { toggleTag, addTag } = useTagsDispatch();
    const [tagName, setTagName] = useState('');

    function handleTagNameChange(event) {
        const name = event.target.value;
        setTagName(name);
    }

    return (
         <Drawer
            title="Tag list"
            placement='left'
            closable={true}
            onClose={() => setIsVisible(false)}
            visible={isVisible}
        >
            <List
                bordered
                dataSource={tags}
                rowKey={(tagElement) => tagElement.tagItem.id}
                renderItem={
                    (tagElement) =>
                        <List.Item
                            key={tagElement.tagItem.id}
                            className={tagElement.selected ? 'item-selected' : ''}
                            onClick={() => toggleTag(tagElement)}>
                                {tagElement.tagItem.name}
                        </List.Item>

                }
            />
            <Input value={tagName} onChange={handleTagNameChange} />
            <Button type="primary" onClick={() => addTag(tagName)}>Add tag</Button>
        </Drawer>
    );
}
