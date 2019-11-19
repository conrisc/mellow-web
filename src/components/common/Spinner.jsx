import React from 'react';

export function Spinner(props) {
    return (
        // <div className="spinner">
        //     <i className="fas fa-spinner fa-pulse fa-3x pink-text"></i>
        // </div>
        <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
                <div className="circle"></div>
            </div>
            <div className="gap-patch">
                <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
                <div className="circle"></div>
            </div>
        </div>
    </div>
    );
}
