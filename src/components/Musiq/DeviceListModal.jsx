import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

function DeviceListModalX(props) {
    const selectedDevices = props.devices.selected;

    useEffect(() => {
        const newDevices = props.devices.online;
        newDevices.forEach(device => {
            device.isChecked = !!(selectedDevices.find(dev => dev.name === device.name) || {}).isChecked;
        });
        props.setSelectedDevices(newDevices);
    }, [props.devices.online]);

    function selectDevice(event, device) {
        device.isChecked = event.target.checked;
        props.setSelectedDevices([...selectedDevices]);
    }

    return (
        <div id="device-list-modal" className="modal">
            <div className="modal-content">
                <h4>Device list</h4>
                <ul>
                    {selectedDevices.map((device) => <li key={device.name}>
                        <label>
                            <input
                                name=""
                                type="checkbox"
                                checked={device.isChecked}
                                onChange={(e) => selectDevice(e, device)}
                            />
                            <span>{device.name}</span>
                        </label>
                    </li>)}
                </ul>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        devices: state.devices
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedDevices: (devices) => dispatch({ type: 'SET_SELECTED_DEVICES', devices })
    }
};

export const DeviceListModal = connect(mapStateToProps, mapDispatchToProps)(DeviceListModalX);
