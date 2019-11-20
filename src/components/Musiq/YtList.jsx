import React from 'react';

export function YtList(props) {
    return (
        <div className="single-view col s6 grey darken-3 white-text">
            <input type="text" onChange={e => {const t = e.target.value; props.getYtItemsDebounced(t)}}></input>
            <ul className="collection">
            {
                props.ytItems.map((el, index) => {
                    return <li key={index}>
                            <div className="row">
                                <div className="col s8">
                                    <a href={`https://youtube.com/watch?v=${el.videoId}`}
                                        target="_blank" rel="noopener noreferrer"
                                        title="Open song in youtube"
                                    >
                                        <span>{el.title}</span>
                                    </a><br />
                                    <button className="btn red" onClick={() => props.loadVideo(el.videoId)}>Remote play</button>
                                    <button className="btn red" onClick={() => props.playVideo(el.videoId)}>Play video</button>
                                </div>
                                <div className="col">
                                    <img src={`https://i.ytimg.com/vi/${el.videoId}/default.jpg`}></img>
                                    {/* <img src={el.thumbnailUrl}></img> */}
                                </div>
                            </div>
                    </li>;
                })
            }
            </ul>
        </div>
    );
}
