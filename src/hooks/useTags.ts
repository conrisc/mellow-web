import { useState, useEffect } from 'react';
import { TagItem } from 'mellov_api';
import { getUsersApi } from 'Services/mellowApi';
import { TagElement } from 'Types/song.types';

interface TagsNameToIdMap {
	[name: string]: string;
}

interface TagsIdToNameMap {
	[id: string]: string;
}

interface UseTagsReturn {
	tags: TagElement[];
	tagsNameToIdMap: TagsNameToIdMap;
	tagsIdToNameMap: TagsIdToNameMap;
	toggleTag: (tagElement: TagElement) => void;
	addTag: (tagName: string) => Promise<boolean>;
	removeTag: (tagId: string) => Promise<void>;
}

export function useTags(): UseTagsReturn {
	const [tags, setTags] = useState<TagElement[]>([]);
	const [tagsNameToIdMap, setTagsNameToIdMap] = useState<TagsNameToIdMap>({});
	const [tagsIdToNameMap, setTagsIdToNameMap] = useState<TagsIdToNameMap>({});

	useEffect(() => {
		getTags();
	}, []);

	useEffect(() => {
		const newTagsNameToIdMap = tags.reduce<TagsNameToIdMap>((acc, tagElement) => {
			acc[tagElement.tagItem.name] = tagElement.tagItem.id;
			return acc;
		}, {});

		const newTagsIdToNameMap = tags.reduce<TagsIdToNameMap>((acc, tagElement) => {
			acc[tagElement.tagItem.id] = tagElement.tagItem.name;
			return acc;
		}, {});

		setTagsNameToIdMap(newTagsNameToIdMap);
		setTagsIdToNameMap(newTagsIdToNameMap);
	}, [tags]);

	async function getTags(): Promise<void> {
		const api = await getUsersApi();
		if (!api) return;

		const skip = 0;
		const limit = 300;

		return api.searchTags(skip, limit).then(
			(data) => {
				const tags = data.map((tagItem) => ({ tagItem, selected: false }));
				tags.sort((t1, t2) => (t1.tagItem.name < t2.tagItem.name ? -1 : 1));
				setTags(tags);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	function toggleTag(tagElement: TagElement): void {
		const newTags = tags.map((el) =>
			tagElement.tagItem.id === el.tagItem.id
				? {
						tagItem: tagElement.tagItem,
						selected: !tagElement.selected,
				  }
				: el
		);
		setTags(newTags);
	}

	async function addTag(tagName: string): Promise<boolean> {
		if (typeof tagName !== 'string' || !tagName.match(/^\w[\w\s-]*\w$/)) {
			console.warn('Tag name does not match criteria!');
			return Promise.resolve(false);
		}

		const tagItem = new TagItem();
		tagItem.name = tagName;
		const api = await getUsersApi();
		if (!api) return false;

		return api
			.addTag(tagItem)
			.then(() => {
				console.log('API called successfully.');
				getTags(); // temporary?
				return true;
			})
			.catch((error) => {
				console.error(error);
				return false;
			});
	}

	async function removeTag(tagId: string): Promise<void> {
		const api = await getUsersApi();
		if (!api) return;

		return api
			.deleteTag(tagId)
			.then(() => {
				console.log('Tag successfully removed');
				getTags(); // temporary?
			})
			.catch((error) => {
				console.error('Error while removing the tag: ', error);
			});
	}

	return {
		tags,
		tagsNameToIdMap,
		tagsIdToNameMap,
		toggleTag,
		addTag,
		removeTag,
	};
}
