import React, { useState, useEffect } from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';

const API_KEY = 'AIzaSyBS6s9-nwxzxCfS0Uazv1-tedGwWwo9CZs';

gapi.load("client");
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => { console.log("GAPI client loaded for API"); },
            (err) => { console.error("Error loading GAPI client for API", err); });
}

setTimeout(() => {
    loadClient();
}, 1000);

export function Musiq(props) {
    const [ searchResult, setSearchResult ] = useState([]);
    const [ songs, setSongs ] = useState([]);

    useEffect(() => {
        getSongs();
    }, []);

    function getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: 3,
            limit: 5
        };

        api.searchSong(opts)
            .then(data => {
                console.log(data);
                setSongs(data);
            }, error => {
                console.error(error);
            });
    }

    function searchVideo(text) {
        return gapi.client.youtube.search.list({
            "part": "snippet",
            "maxResults": 5,
            "type": "video",
            "q": text
        }).then((response) => {
                console.log("Response", response);
                setSearchResult(response.result ? response.result.items : []);
            },
            (err) => { console.error("Execute error", err); });
    }

    const handleSearchChange = debounce(1000, searchVideo);

    return (
        <div>
            <input type="text" onChange={e => {const t = e.target.value; handleSearchChange(t)}}></input>
            <div className="row">
                <div className="col s6">
                    <TrackList songs={songs} findSong={searchVideo} />
                </div>
                <div className="col s6">
                    {
                        searchResult.map((el, index) => {
                            return <div key={index}>
                                <a href={`https://youtube.com/watch?v=${el.id.videoId}`}>
                                    <h5>{el.snippet.title}</h5>
                                    <h6>{el.id.videoId}</h6>
                                    <img src={el.snippet.thumbnails.medium.url}></img>
                                </a>
                            </div>;
                        })
                    }
                </div>
            </div>
        </div>
    );
}