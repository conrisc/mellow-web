import React, { useState, useEffect } from 'react';
import { UsersApi, TagItem } from 'what_api';

export function useTags() {
    const [tags, setTags] = useState([]);
    const [tagsNameToIdMap, setTagsNameToIdMap] = useState([]);
    const [tagsIdToNameMap, setTagsIdToNameMap] = useState([]);

	useEffect(() => {
		getTags();
    }, []);

    useEffect(() => {
        const newTagsNameToIdMap = tags.reduce(
            (acc, tagElement) => {
                acc[tagElement.tagItem.name] = tagElement.tagItem.id;
                return acc;
            },
        {});

        const newTagsIdToNameMap = tags.reduce(
            (acc, tagElement) => {
                acc[tagElement.tagItem.id] = tagElement.tagItem.name;
                return acc;
            },
        {});

        setTagsNameToIdMap(newTagsNameToIdMap);
        setTagsIdToNameMap(newTagsIdToNameMap);
    }, [tags]);

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

    function addTag(tagName) {
        if (typeof tagName !== 'string' || !tagName.match(/^\w[\w\s-]*\w$/)) {
            console.warn('Tag name does not match criteria!')
            return Promise.resolve(false);
        }

        const api = new UsersApi();

        const opts = {
            tagItem: new TagItem(tagName)
        }

        return api.addTag(opts)
            .then(data => {
                console.log('API called successfully.', data);
                getTags(); // temporary?
                return true;
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    function removeTag(tagId) {
        const api = new UsersApi();
        return api.removeTag(tagId)
            .then(() => {
                console.log('Tag successfuly removed');
                getTags(); // temporary?
            })
            .catch(error => {
                console.error('Error while removing the tag: ', error);
            });
    }

	return {
        tags,
        tagsNameToIdMap,
        tagsIdToNameMap,
        toggleTag,
        addTag,
        removeTag
	};
}
