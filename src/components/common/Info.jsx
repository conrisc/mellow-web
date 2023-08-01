import React from 'react';
import { Spinner } from './Spinner';

export function Info(props) {
    return (
        <div>
            {
                props.showSpinner ?
                    <Spinner size="large" center={true} /> :
                    <span className="msg-info">{props.msg}</span>
            }
        </div>
    );
}
