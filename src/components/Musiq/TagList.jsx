import React, { useEffect, useState, useRef } from 'react';
import { DevelopersApi, TagItem } from 'what_api';

export function TagList(props) {
    const tagNameInputRef = useRef();

    useEffect(() => {
        const elems = document.querySelectorAll('.sidenav');
        const instances = M.Sidenav.init(elems, {});
    }, []);

    function addTag() {
        const tagName = tagNameInputRef.current.value;
        if (!tagName.match(/^\w[\w\s-]*\w$/)) {
            console.warn('Tag name does not match criteria!')
            return;
        }

        const api = new DevelopersApi();

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
        <div>
            <a href="#" data-target="slide-out" className="sidenav-trigger">
                Tags
            </a>
            <div id="slide-out" className="sidenav">
                <h5>Tags</h5>
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
            </div>
        </div>
    );
}