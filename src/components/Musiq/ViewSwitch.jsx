import React from 'react';

export function ViewSwitch(props) {
    return (
        <div className="view-switch hide-on-large-only">
            <button className="btn btn-small w-50 h-100 red" onClick={() => props.mainViewRef.current.classList.add('transform-left-50')}>YTLIST</button>
            <button className="btn btn-small w-50 h-100" onClick={() => props.mainViewRef.current.classList.remove('transform-left-50')}>SONG LIST</button>
        </div>
    );
}
