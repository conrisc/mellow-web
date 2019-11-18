import React, { useEffect } from 'react';

export function Toast(props) {
    const toasts = props.data;

    function isNew(toast) {
        return (new Date() - toast.date) < 15000;
    }

    useEffect(() => {
        const timerId = setInterval(updateToasts, 5000);
        return () => {
            clearInterval(timerId);
        }
    });

    function updateToasts() {
        const newToasts = toasts.filter(isNew);
        props.setToasts(newToasts);
    }

    return (
        <div className="toast-container">
            {
                toasts.map((el, index)=> {
                    const timeItems = [
                        el.date.getHours(),
                        el.date.getMinutes(),
                        el.date.getSeconds()
                    ]
                    
                    const date = timeItems.map(ti => ('0' + ti).slice(-2)).join(':');
                    return <div key={index} className="toast-item z-depth-3">
                        <span className="small-text grey-text">
                            <i className="far fa-clock"></i> {date}
                        </span><br />
                        <span>{el.text}</span>
                    </div>;
                })
            }
        </div>
    );
}
