import React from 'react';

export function YTList(props) {
    const items = props.items;

    return (
        <div>
            <ul className="collection">
            {
                items.map((el, index) => {
                    return <li key={index}>
                            <div className="row">
                                <div className="col s8">
                                    <a href={`https://youtube.com/watch?v=${el.id.videoId}`}>
                                        <span>{el.snippet.title}</span><br/>
                                    </a>
                                    <span>{el.id.videoId}</span>
                                    <button className="btn red" onClick={() => props.loadVideo(el.id.videoId)}>Play video</button>
                                </div>
                                <div className="col">
                                    <img src={el.snippet.thumbnails.default.url}></img>
                                </div>
                            </div>
                    </li>;
                })
            }
            </ul>
        </div>
    );
}
