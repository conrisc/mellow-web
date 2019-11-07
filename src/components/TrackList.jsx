import React from 'react';

export function TrackList(props) {
    const songs = props.songs;
    

    return (
        <div>
            <ul className="collection">
                {
                    songs.map((songItem, index) => {
                        const date = new Date(songItem.dateAdded).toGMTString();
                        return <li className="collection-item row" key={index}>
                            <div className="col">
                                <h6 className="bold">{songItem.title}</h6>
                                <p>
                                    <span>{date}</span>
                                </p>
                            </div>
                            <div className="col s3 right right-text">
                                <button className="btn btn-small" onClick={() => props.findSong(songItem.title)}>
                                    <i className="fab fa-youtube"></i> 
                                </button>
                                <a href={songItem.url} className={'btn btn-small' + (songItem.url ? '' : ' disabled')}>
                                    <i className="fas fa-link"></i>
                                </a>
                            </div>
                        </li>;
                    })
                }
            </ul>
        </div>
    );
}
