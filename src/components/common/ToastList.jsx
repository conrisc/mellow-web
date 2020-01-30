import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import { Toast } from 'CommonComponents/Toast';

function ToastListX(props) {
    const { toasts, dismissToast } = props;

    return (
        <div className="toast-container">
            {
                toasts.map(
                    (toast) => <Toast key={toast.id} toast={toast} dismissToast={dismissToast} />
                )
            }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        toasts: state.toasts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dismissToast: (id) => dispatch({ type: 'DISMISS_TOAST', id })
    };
};

const ToastList = connect(mapStateToProps, mapDispatchToProps)(ToastListX);

export {
    ToastList
}