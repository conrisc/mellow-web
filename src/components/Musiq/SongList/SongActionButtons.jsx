import React from 'react';

export function SongActionButtons(props) {
    const songItem = props.songItem;
    const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    const encodedTitle = encodeURIComponent(songItem.title);

    return (
        <div className="col s5 right right-text">
            <a
            href={"https://www.youtube.com/results?search_query=" + encodedTitle}
            className="btn btn-small"
            target="_blank" rel="noopener noreferrer"
            title="Search song in youtube">
                <i className="fas fa-link"></i>
            </a>
            <a
            href={songItem.url}
            className={"btn btn-small" + (songItem.url ? '' : ' disabled')}
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
            className={"btn btn-small" + (videoId ? '' : ' disabled')}
            onClick={() => props.loadVideo(videoId)}
            title="Play song on other devices">
                <i className="fas fa-play"></i>
            </button>
            <button
            className={"btn btn-small" + (videoId ? '' : ' disabled')}
            onClick={() => props.playVideo(videoId, props.index)}
            title="Play song on this device">
                PY
            </button>
        </div>
    );
}
