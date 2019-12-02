import React from 'react';

export function SongFilterPanel(props) {

    function handleTitleFilterChange(event) {
        props.setTitleFilter(event.target.value)
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
                    id="searchBar"
                    type="text"
                    value={props.titleFilter}
                    onChange={handleTitleFilterChange}
                />
                <label htmlFor="searchBar">Search song</label>
            </div>
            <div className="input-field col s2">
                <input
                    id="skip"
                    type="number"
                    value={props.skip}
                    onChange={e => { props.setSkip(Number(e.target.value)); props.getSongsDebounced(); }}
                    min="0"
                />
                <label htmlFor="skip">Skip</label>
                <i className="fas fa-times" onClick={() => console.log('lo')}></i>
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
        </div>
    );
}
