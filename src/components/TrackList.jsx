import React from 'react';

export function TrackList(props) {
    const songs = props.songs;
    

    return (
        <div>
            <ul className="collection">
                {
                    songs.map((songItem, index) => {
                        const date = new Date(songItem.dateAdded).toGMTString();
                        const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                        const videoId = videoIdMatch ? videoIdMatch[1] : '';
                        return <li className="collection-item row" key={index}>
                            <div className="col">
                                <h6 className="bold">{songItem.title}</h6>
                                {
                                    songItem.tags.map((tagItem, index) => <span key="index" className="tag-item">{tagItem}</span>)
                                }
                                <p>
                                    <span className="small-text grey-text">{date}</span>
                                </p>
                            </div>
                            <div className="col s3 right right-text">
                                <a
                                href={songItem.url}
                                className={"btn btn-small" + (songItem.url ? '' : ' disabled')}
                                target="_blank" rel="noopener noreferrer"
                                title="Open song in youtube">
                                    <i className="fas fa-link"></i>
                                </a>
                                <button
                                className={"btn btn-small" + (videoId ? '' : ' disabled')}
                                onClick={() => props.loadVideo(videoId)}
                                title="Play song on other devices">
                                    <i className="fas fa-play"></i>
                                </button>
                                <button
                                className="btn btn-small"
                                onClick={() => props.findSong(songItem.title)}
                                title="Find this song on youtube">
                                    <i className="fab fa-youtube"></i>
                                </button>
                            </div>
                        </li>;
                    })
                }
            </ul>
        </div>
    );
}
