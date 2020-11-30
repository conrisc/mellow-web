import React, { useRef } from 'react';
import { UsersApi, TagItem } from 'what_api';
import { Drawer } from 'antd';

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
            <ul className="collection">
                {
                    props.tags.map(tagElement =>
                        <li key={tagElement.tagItem.id}
                            className={"collection-item" + (tagElement.selected ? ' active' : '')}
                            onClick={() => props.toggleTag(tagElement)}>{tagElement.tagItem.name}
                        </li>
                    )
                }
            </ul>
            <input ref={tagNameInputRef} type="text"></input>
            <button onClick={addTag}>Add tag</button>
        </Drawer>
    );
}