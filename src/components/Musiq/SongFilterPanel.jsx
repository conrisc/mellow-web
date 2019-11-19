import React from 'react';

export function SongFilterPanel(props) {
    return (
        <div className="row">
            <div className="input-field col s2">
                <input
                    id="skip"
                    type="number"
                    value={props.skip}
                    onChange={e => { props.setSkip(Number(e.target.value)); props.getSongsDebounced(); }}
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
        </div>
    );
}
