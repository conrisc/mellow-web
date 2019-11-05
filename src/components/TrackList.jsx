import React from 'react';

export function TrackList(props) {
    const songs = props.songs;

    return (
        <div>
            {
                songs.map((songItem, index) => {
                    return <p key={index}>
                        <a href={songItem.url}>{songItem.title}</a>
                        <span>Date added: {songItem.dateAdded}</span>
                        <button className="btn btn-small" onClick={() => props.findSong(songItem.title)}>Find song</button>
                    </p>;
                })
            }
        </div>
    );
}
