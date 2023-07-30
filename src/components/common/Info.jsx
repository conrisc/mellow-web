import React from 'react';
import { Spinner } from './Spinner';

export function Info(props) {
    return (
        <div>
            {
                props.shouldShowSpinner ?
                    <Spinner /> :
                    <span className="msg-info">{props.msg}</span>
            }
        </div>
    );
}
