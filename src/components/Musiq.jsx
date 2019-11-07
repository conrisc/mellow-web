import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { TrackList } from './TrackList';
import { YTList } from './YTList';

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

const loadYT = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT)
})


export function Musiq(props) {
    const [ ytItems, setYtItems ] = useState([]);
    const [ songs, setSongs ] = useState([]);
    let player;

    useEffect(() => {
        getSongs();

        console.log(loadYT);
        loadYT.then((YT) => {
            player = new YT.Player('player', {
                height: 390,
                width: 640,
                videoId: 'LlY90lG_Fuw',
                events: {
                },
                playerVars: { 'origin': 'https://what-appy.herokuapp.com/' }
            })
        })
    }, []);

    function getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: 0,
            limit: 10
        };

        api.searchSong(opts)
            .then(data => {
                setSongs(data);
            }, error => {
                console.error(error);
            });
    }

    function searchVideo(text) {
        if (!text || text === '') {
            console.log('searchVideo: input is empty');
            return;
        }

        return gapi.client.youtube.search.list({
            "part": "snippet",
            "maxResults": 5,
            "type": "video",
            "q": text
        }).then((response) => {
                setYtItems(response.result ? response.result.items : []);
            },
            (err) => { console.error("Execute error", err); });
    }

    const handleSearchChange = debounce(1000, searchVideo);


    return (
        <div>
            <Link to='/' className="btn">Go back</Link>
            <input type="text" onChange={e => {const t = e.target.value; handleSearchChange(t)}}></input>
            <div className="row">
                <div className="col s6">
                    <TrackList songs={songs} findSong={searchVideo} />
                </div>
                <div className="col s6">
                    <YTList items={ytItems} />
                </div>
                <div id="player"></div>
            </div>
        </div>
    );
}
