import React from 'react';

export function DeviceListModal(props) {
    const devices = props.devices || [];

    return (
        <div id="device-list-modal" className="modal">
            <div className="modal-content">
                <h4>Device list</h4>
                <ul>
                    {devices.map((device) => <li key={device.name}>{device.name}</li>)}
                </ul>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>
    );
}
