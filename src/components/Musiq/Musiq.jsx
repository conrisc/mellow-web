import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { musiqWebsocket } from 'Services/musiqWebsocket';
import { YtPlayer } from './YtPlayer';
import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';

class MusiqX extends React.Component {

    constructor(props) {
        super(props);

        this.webSocket = musiqWebsocket.getInstance({
            setOnline: this.props.setOnline,
            setOffline: this.props.setOffline
        });
    }

    componentDidMount() {
        document.querySelector('#manifest-placeholder').setAttribute('href', '/manifest-musiq.json');
        this.webSocket.open();
    }

    componentWillUnmount() {
        this.webSocket.close();
    }

    render() {
        return (
            <div>
                {this.props.ytPlayer &&
                    <div>
                        <TopPanel />
                        <MainView />
                        <BottomPanel />
                    </div>
                }
                <YtPlayer />
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setOnline: () => dispatch({ type: 'SET_ONLINE' }),
        setOffline: () => dispatch({ type: 'SET_OFFLINE' })
    };
}

export const Musiq = connect(mapStateToProps, mapDispatchToProps)(MusiqX);
