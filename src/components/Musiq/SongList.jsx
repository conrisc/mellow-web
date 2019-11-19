import React, { useState, useEffect } from 'react';
import { DevelopersApi } from 'what_api';

export function SongList(props) {
    const songs = props.songs;
    const tagsIdToNameMap = props.tags.reduce(
        (acc, tagElement) => { 
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        }, 
    {});
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(30);

    useEffect(() => {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    }, []);
    
    return (
        <div>
            <div className="row">
                <div className="input-field col s2">
                    <input
                        id="skip"
                        type="number"
                        value={skip}
                        onChange={e => { setSkip(Number(e.target.value)) }}
                        min="0"
                    />
                    <label htmlFor="skip">Skip</label>
                </div>
                <div className="input-field col s2">
                    <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                    </select>
                    <label>Limit</label>
                </div>
            </div>
            <ul className="collection">
                {
                    songs.map((songItem, index) => {
                        const date = new Date(songItem.dateAdded).toGMTString();
                        const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                        const videoId = videoIdMatch ? videoIdMatch[1] : '';
                        return (
                            <li className="collection-item row" key={index}>
                                <div className="col">
                                    <h6 className="bold">{songItem.title}</h6>
                                    {
                                        songItem.tags.map(tagId => <span key={tagId} className="tag-item">{tagsIdToNameMap[tagId]}</span>)
                                    }
                                    <p>
                                        <span className="small-text grey-text">{date}</span>
                                    </p>
                                </div>
                                <div className="col s5 right right-text">
                                    <a
                                    href={"https://www.youtube.com/results?search_query="+songItem.title}
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
                                    onClick={() => props.playVideo(videoId, index)}
                                    title="Play song on this device">
                                        PY
                                    </button>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}
