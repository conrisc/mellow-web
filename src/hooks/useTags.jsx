import React, { useState, useEffect } from 'react';
import { TagItem } from 'mellov_api';
import { getUsersApi } from 'Services/mellowApi';

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

    async function getTags() {
        const api = await getUsersApi();

        const opts = {
            skip: 0,
            limit: 300
        };

        return api.searchTags(opts)
            .then(data => {
                const tags = data.map(tagItem => ({ tagItem, selected: false }));
                tags.sort((t1, t2) => t1.tagItem.name < t2.tagItem.name ? -1 : 1);
                setTags(tags);
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

    async function addTag(tagName) {
        if (typeof tagName !== 'string' || !tagName.match(/^\w[\w\s-]*\w$/)) {
            console.warn('Tag name does not match criteria!')
            return Promise.resolve(false);
        }

        const tagItem = new TagItem();
        tagItem.name = tagName;
        const api = await getUsersApi();

        return api.addTag(tagItem)
            .then(data => {
                console.log('API called successfully.');
                getTags(); // temporary?
                return true;
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    async function removeTag(tagId) {
        const api = await getUsersApi();
        return api.deleteTag(tagId)
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
