import React, { useState } from 'react';
import { Drawer, List, Button, Input, Modal } from 'antd';

import { useTagsState, useTagsDispatch } from './TagsContext';

function RemoveTagButton(props) {
    return (
        <Button
            size="small"
            type="text"
            danger
            icon={<i className="far fa-trash-alt"></i>}
            {...props}
        />
    );
}

export function TagList(props) {
    const { isVisible, setIsVisible } = props;
    const { tags } = useTagsState();
    const { toggleTag, addTag, removeTag } = useTagsDispatch();
    const [tagName, setTagName] = useState('');
    const [hoveredTag, setHoveredTag] = useState();

    function handleTagNameChange(event) {
        const name = event.target.value;
        setTagName(name);
    }

    function showRemoveConfirmation(event, tagElement) {
        event.stopPropagation();
        Modal.confirm({
            title: `Are you sure you want to remove tag "${tagElement.tagItem.name}"?`,
            content: 'This tag will be removed from all the songs!',
            icon: <i
                    style={{ float: 'left', fontSize: 21, color: '#faad14', marginRight: 16 }}
                    className="fas fa-exclamation-circle">
                </i>,
            onOk() {
                console.log('Removing tag ', tagElement.tagItem.name);
                removeTag(tagElement.tagItem.id);
            },
            onCancel() {}
        });
    }

    function handleAddTag() {
        addTag(tagName)
            .then(res => {
                if (res) setTagName('');
                //else display information why tag cannot be added
            });
    }

    return (
         <Drawer
            title="Tag list"
            placement="left"
            closable={true}
            onClose={() => setIsVisible(false)}
            visible={isVisible}
        >
            <List
                size="small"
                dataSource={tags}
                rowKey={(tagElement) => tagElement.tagItem.id}
                renderItem={
                    (tagElement) =>
                        <List.Item
                            actions={
                                hoveredTag === tagElement
                                    ? [<RemoveTagButton onClick={e => showRemoveConfirmation(e, tagElement)} />]
                                    : []
                            }
                            key={tagElement.tagItem.id}
                            className={tagElement.selected ? 'item-selected' : ''}
                            onClick={() => toggleTag(tagElement)}
                            onMouseEnter={() => setHoveredTag(tagElement)}
                            onMouseLeave={() => setHoveredTag()}
                        >
                                {tagElement.tagItem.name}
                        </List.Item>

                }
            />
            <Input value={tagName} onChange={handleTagNameChange} />
            <Button type="primary" onClick={handleAddTag}>Add tag</Button>
        </Drawer>
    );
}
