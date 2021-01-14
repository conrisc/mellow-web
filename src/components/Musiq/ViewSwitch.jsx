import React from 'react';

export function ViewSwitch(props) {
    return (
        <div className="view-switch hide-on-lg">
            <button className={"btn btn-small w-100 h-100 " + props.customClasses} onClick={props.switchView}>{props.nextViewName}</button>
        </div>
    );
}
