import React, { useState } from 'react';
import { debounce } from 'throttle-debounce';

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
    );
}