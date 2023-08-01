import React from 'react';
import { Alert } from 'antd';
import { Spinner } from './Spinner';

export function Info(props) {
    return (
        <div>
            {
                props.showSpinner ?
                    <Spinner size="large" center={true} /> :
                    <Alert message={props.msg} type="error" showIcon />
            }
        </div>
    );
}
