import React, { useState, useEffect } from 'react';
import { UsersApi } from 'what_api';

export function useTags() {
	const [tags, setTags] = useState([]);

	useEffect(() => {
		getTags();
	}, []);

    function getTags() {
        const api = new UsersApi();

        const opts = {
            skip: 0,
            limit: 300
        };

        api.searchTag(opts)
            .then(data => {
				setTags(data.map(tagItem => ({ tagItem, selected: false })))
            }, error => {
                console.error(error);
            });
    }

    function toggleTag(tagElement) {
        const newTags = tags.map(el =>
			tagElement.tagItem.id === el.tagItem.id
				? {
                    tagItem: tagElement.tagItem,
                    selected: !tagElement.selected
				}
				: el
        );
		setTags(newTags);
	}

	return {
		tags,
		toggleTag
	};
}