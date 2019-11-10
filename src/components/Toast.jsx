import React, { useState, useEffect } from 'react';

export function Toast(props) {
    const [ toasts, setToasts ]= useState(props.data.filter(isNew));

    function isNew(toast) {
        return (new Date() - toast.date) < 15000;
    }

    useEffect(() => {
        const timerId = setInterval(updateToasts, 5000);
        return () => {
            clearInterval(timerId);
        }
    }, []);

    function updateToasts() {
        setToasts(props.data.filter(isNew));
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
