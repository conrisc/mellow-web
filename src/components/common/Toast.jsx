import React, { useEffect } from 'react';

export function Toast(props) {
    const { toast, dismissToast } = props;

    useEffect(() => {
        setTimeout(() => {
            console.log('Removing toast with id:', toast.id)
            dismissToast(toast.id);
        }, 15000);
    }, []);


    const timeItems = [
        toast.date.getHours(),
        toast.date.getMinutes(),
        toast.date.getSeconds()
    ];
    const date = timeItems.map(ti => ('0' + ti).slice(-2)).join(':');

    return <div className="toast-item z-depth-3">
        <span className="small-text grey-text">
            <i className="far fa-clock"></i> {date}
        </span><br />
        <span>{toast.text}</span>
    </div>;
}
