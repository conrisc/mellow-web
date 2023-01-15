import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";
import { Drawer, List, Button, Input, Modal, Row, Col } from 'antd';

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

const TAGS_QUERY_PARAM = 'tags';

export function TagList(props) {
    const { isOpen, setIsOpen } = props;
    const { tags } = useTagsState();
    const { toggleTag, addTag, removeTag } = useTagsDispatch();
    const [tagName, setTagName] = useState('');
    const [hoveredTag, setHoveredTag] = useState();
    const searchQuery = useLocation().search;
    const [serachParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const searchParams = new URLSearchParams(searchQuery);
        searchParams.getAll(TAGS_QUERY_PARAM)
            .map(tagName =>
                tags.find(tagElement => tagElement.tagItem.name === tagName)
            )
            .filter(tagElement => tagElement && !tagElement.selected)
            .forEach(tagElement => toggleTag(tagElement));

    }, [tags]);

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

    function handleClickTag(tagElement) {
        const searchParams = new URLSearchParams(searchQuery);
        if (tagElement.selected) {
            const selectedTags = searchParams.getAll(TAGS_QUERY_PARAM)
                .filter(tagName => tagName !== tagElement.tagItem.name);
            searchParams.delete(TAGS_QUERY_PARAM);
            selectedTags.forEach(tagName =>
                searchParams.append(TAGS_QUERY_PARAM, tagName)
            );
        } else {
            searchParams.append(TAGS_QUERY_PARAM, tagElement.tagItem.name);
        }
        setSearchParams(searchParams);
        toggleTag(tagElement);
    }

    const content = <>
            <Row justify="center">
                <Col flex={'auto'} style={{ marginBottom: 8 }}>
                    <Input value={tagName} onChange={handleTagNameChange} />
                </Col>
                <Col style={{ marginBottom: 8 }}>
                    <Button style={{width: '100%'}} type="primary" onClick={handleAddTag}>Add tag</Button>
                </Col>
            </Row>
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
                            onClick={() => handleClickTag(tagElement)}
                            onMouseEnter={() => setHoveredTag(tagElement)}
                            onMouseLeave={() => setHoveredTag()}
                        >
                                {tagElement.tagItem.name}
                        </List.Item>

                }
            />
        </>

    return (
        <>
            <Drawer
                title="Tag List"
                placement="bottom"
                height={'80%'}
                closable={true}
                onClose={() => setIsOpen(false)}
                open={isOpen}
            >
                {content}
            </Drawer>
            <div className="tag-list hide-on-xs side-bar">
                {content}
            </div>
        </>
    );
}
