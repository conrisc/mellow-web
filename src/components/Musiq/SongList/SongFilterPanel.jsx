import React, {useRef} from 'react';

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

    return (
        <div className="row mt-1">
            <div className="input-field col">
                <a href="#" data-target="slide-out" className="mt-1 sidenav-trigger btn btn-small">
                    <i className="fas fa-tags"></i>
                </a>
            </div>
            <div className="input-field col s6">
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
            <div className="input-field col">
                <button data-target="add-song-modal" className="btn btn-small mt-1 modal-trigger">
                    <i className="fas fa-plus"></i>
                </button>
            </div>
        </div>
    );
}
