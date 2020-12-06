import React, { useRef } from 'react';
import { UsersApi, TagItem } from 'what_api';
import { Drawer, List, Button, Input } from 'antd';

export function TagList(props) {
    const tagNameInputRef = useRef();

    function addTag() {
        const tagName = tagNameInputRef.current.value;
        if (!tagName.match(/^\w[\w\s-]*\w$/)) {
            console.warn('Tag name does not match criteria!')
            return;
        }

        const api = new UsersApi();

        const opts = {
            tagItem: new TagItem(tagName)
        }

        api.addTag(opts)
            .then(data => {
                console.log('API called successfully.', data);
            }, error => {
                console.error(error);
            });
    }

    return (
         <Drawer
            title="Tag list"
            placement='left'
            closable={true}
            onClose={() => props.setIsVisible(false)}
            visible={props.isVisible}
        >
            <List
                bordered
                dataSource={props.tags}
                rowKey={(tagElement) => tagElement.tagItem.id}
                renderItem={
                    (tagElement) =>
                        <List.Item
                            key={tagElement.tagItem.id}
                            className={tagElement.selected ? ' grey lighten-4' : ''}
                            onClick={() => props.toggleTag(tagElement)}>
                                {tagElement.tagItem.name}
                        </List.Item>

                }
            />
            <Input ref={tagNameInputRef} />
            <Button type="primary" onClick={addTag}>Add tag</Button>
        </Drawer>
    );
}