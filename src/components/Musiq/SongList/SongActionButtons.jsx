import React from 'react';

export function SongActionButtons(props) {
    const songItem = props.songItem;
    const encodedTitle = encodeURIComponent(songItem.title);

    return (
        <div className="col right right-text">
            <a
            href={"https://www.youtube.com/results?search_query=" + encodedTitle}
            className="btn btn-small hide-on-small-only"
            target="_blank" rel="noopener noreferrer"
            title="Search song in youtube">
                <i className="fas fa-search"></i>
            </a>
            <a
            href={songItem.url}
            className={"btn btn-small hide-on-small-only" + (songItem.url ? '' : ' disabled')}
            target="_blank" rel="noopener noreferrer"
            title="Open song in youtube">
                <i className="fas fa-link"></i>
            </a>
            <button
            className="btn btn-small"
            onClick={() => props.getYtItems(songItem.title)}
            title="Find this song using youtube">
                <i className="fab fa-youtube"></i>
            </button>
            <button
            className={"btn btn-small" + (props.videoId ? '' : ' disabled')}
            onClick={() => props.loadVideo(props.videoId)}
            title="Play song on other devices">
                <i className="fas fa-tv"></i>
            </button>
            <button
            className={"btn btn-small" + (props.videoId ? '' : ' disabled')}
            onClick={() => props.playVideo(props.videoId, props.index)}
            title="Play song on this device">
                <i className="fas fa-play"></i>
            </button>
        </div>
    );
}
