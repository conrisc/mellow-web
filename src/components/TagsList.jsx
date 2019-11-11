import React, { useEffect, useState, useRef } from 'react';
import { DevelopersApi, TagItem } from 'what_api';

export function TagsList(props) {
    const [ tags, setTags ] = useState([]);
    const tagNameInputRef = useRef();

    useEffect(() => {
        getTags();
        const elems = document.querySelectorAll('.sidenav');
        const instances = M.Sidenav.init(elems, {});
    }, []);

    function getTags() {
        const api = new DevelopersApi();

        const opts = {
            skip: 0,
            limit: 300
        };

        api.searchTag(opts)
            .then(data => {
                setTags(data)
            }, error => {
                // this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    function addTag() {
        const tagName = tagNameInputRef.current.value;

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
            <ul id="slide-out" className="sidenav">
                <h5>Tags</h5>
                <input ref={tagNameInputRef} type="text"></input>
                <button onClick={addTag}>Add tag</button>
                {
                    tags.map(tagItem =>
                        <p>{tagItem.name}</p>
                    )
                }
            </ul>
        </div>
    );
}