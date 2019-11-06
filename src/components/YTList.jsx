import React from 'react';

export function YTList(props) {
    const items = props.items;

    return (
        <div>
            {
                items.map((el, index) => {
                    return <div key={index}>
                        <a href={`https://youtube.com/watch?v=${el.id.videoId}`}> 
                            <div className="row">
                                <div className="col s8">
                                    <span>{el.snippet.title}</span><br/>
                                    <span>{el.id.videoId}</span>
                                </div>
                                <div className="col">
                                    <img src={el.snippet.thumbnails.default.url}></img>
                                </div>
                            </div>
                        </a>
                    </div>;
                })
            }
        </div>
    );
}
