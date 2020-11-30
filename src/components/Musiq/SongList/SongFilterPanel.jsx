import React, {useRef} from 'react';
import { Button } from 'antd';

export function SongFilterPanel(props) {
    const serachSongsInputRef = useRef();


    function handleTitleFilterChange(event) {
        handleTitleChange(event.target.value)
    }

    function clearSearchSongsInput() {
        handleTitleChange('');
        serachSongsInputRef.current.focus();
    }

    function handleTitleChange(title) {
        props.setSkip(0);
        props.setTitleFilter(title);
        props.getSongsDebounced();
    }

    function updateSkip(event) {
        props.setSkip(Number(event.target.value));
        props.getSongsDebounced();
    }

    function updateSort(event) {
        props.setSkip(0);
        props.setSort(event.target.value);
        props.getSongsDebounced();
    }

    return (
        <div className="row mt-1">
            <div className="input-field col">
                <Button onClick={props.showTagsDrawer}>
                    <i className="fas fa-tags"></i>
                </Button>
            </div>
            <div className="input-field col s4">
                <input
                    ref={serachSongsInputRef}
                    id="searchBar"
                    type="text"
                    value={props.titleFilter}
                    onChange={handleTitleFilterChange}
                />
                <button className="clear-input" onClick={clearSearchSongsInput}>
                    <i className="fas fa-times"></i>
                </button>
                <label htmlFor="searchBar">Search song</label>
            </div>
            <div className="input-field col s2">
                <input
                    id="skip"
                    type="number"
                    value={props.skip}
                    onChange={updateSkip}
                    min="0"
                />
                <label htmlFor="skip">Skip</label>
            </div>
            <div className="input-field col s2">
                <select
                    value={props.limit}
                    onChange={e => props.setLimit(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>
                <label>Limit</label>
            </div>
            <div className="input-field col s2">
                <select
                    value={props.sort}
                    onChange={updateSort}>
                    <option value={'none'}>None</option>
                    <option value={'title_asc'}>Title Asc</option>
                    <option value={'title_desc'}>Title Desc</option>
                    <option value={'random'}>Random</option>
                </select>
                <label>Sort</label>
            </div>
            <div className="input-field col">
                <Button onClick={props.showNewSongModal}>
                    <i className="fas fa-plus"></i>
                </Button>
            </div>
        </div>
    );
}
