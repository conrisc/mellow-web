import React from 'react';

import { Spinner } from 'CommonComponents/Spinner';

export function YtList(props) {

    function loadVideoById(videoId) {
        props.playerLoader.then(player => {
            player.loadVideoById(videoId)
        });
    }

    function handleSearchChange(event) {
        const title = event.target.value;
        props.getYtItemsDebounced(title);
    }

    return (
        <div className="single-view col s6 grey darken-3 white-text">
            <div className="input-field">
                <input id="ytSearchBar" type="text" className="white-text" onChange={handleSearchChange}></input>
                <label htmlFor="ytSearchBar">Search youtube</label>
            </div>
            {
                props.isFetchingYtItems ?
                    <div className="center-align">
                        <Spinner />
                    </div>
                :
                    <ul className="">
                        {
                            props.ytItems.map((el, index) => {
                                return <li className="bb-1 mt-1" key={index}>
                                        <div className="row">
                                            <div className="col s8">
                                                <a href={`https://youtube.com/watch?v=${el.videoId}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    title="Open song in youtube"
                                                >
                                                    <span>{el.title}</span>
                                                </a><br />
                                                <div className="mt-1">
                                                    <button className="btn red" onClick={() => props.loadVideo(el.videoId)}>
                                                        <i className="fas fa-tv"></i>
                                                    </button>
                                                    <button className="btn red" onClick={() => loadVideoById(el.videoId)}>
                                                        <i className="fas fa-play"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col right">
                                                <img src={`https://i.ytimg.com/vi/${el.videoId}/default.jpg`}></img>
                                                {/* <img src={el.thumbnailUrl}></img> */}
                                            </div>
                                        </div>
                                </li>;
                            })
                        }
                    </ul>
            }
        </div>
    );
}
