import React, { createContext, useContext } from 'react';

import { useTags } from './useTags';

const TagsStateContext = createContext();
const TagsDispatchContext = createContext();

export function TagsProvider({ children }) {
	const {
		tags, tagsNameToIdMap, tagsIdToNameMap,
		toggleTag, addTag
	} = useTags();

	return (
		<TagsStateContext.Provider value={{ tags, tagsNameToIdMap, tagsIdToNameMap }}>
			<TagsDispatchContext.Provider value={{ toggleTag, addTag }}>
				{ children }
			</TagsDispatchContext.Provider>
		</TagsStateContext.Provider>
	)
}

export function useTagsState() {
	const context = useContext(TagsStateContext);
	if (context === undefined) {
		throw new Error('TagsStateContext must be used within a TagsProvider');
	}
	return context;
}

export function useTagsDispatch() {
	const context = useContext(TagsDispatchContext);
	if (context === undefined) {
		throw new Error('TagsDispatchContext must be used within a TagsProvider');
	}
	return context;
}
