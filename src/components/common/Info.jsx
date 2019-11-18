import React from 'react';
import { Spinner } from './Spinner';

export function Info(props) {
    return (
        <div className="mt-3">
            {
                props.shouldShowSpinner ?
                    <Spinner /> :
                    <span className="msg-info">{props.msg}</span>
            }
        </div>
    );
}
