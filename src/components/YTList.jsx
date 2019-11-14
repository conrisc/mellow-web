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
                                    <a href={`https://youtube.com/watch?v=${el.videoId}`}>
                                        <span>{el.title}</span><br/>
                                    </a>
                                    <span>{el.videoId}</span>
                                    <button className="btn red" onClick={() => props.loadVideo(el.videoId)}>Play video</button>
                                </div>
                                <div className="col">
                                    <img src={el.thumbnailUrl}></img>
                                </div>
                            </div>
                    </li>;
                })
            }
            </ul>
        </div>
    );
}
