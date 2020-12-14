import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { musiqWebsocket } from 'Services/musiqWebsocket';
import { YtPlayer } from './YtPlayer';
import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';

function MusiqX(props) {
    const { ytPlayer, setOnline, setOffline } = props;
    const webSocket = useRef(musiqWebsocket.getInstance({ setOnline, setOffline }));

    useEffect(() => {
        document.querySelector('#manifest-placeholder').setAttribute('href', '/manifest-musiq.json');
        webSocket.current.open();

        return () => {
            webSocket.current.close();
        }
    }, []);

    return (
        <div>
            {ytPlayer &&
                <div>
                    <TopPanel />
                    <MainView />
                    <BottomPanel />
                </div>
            }
            <YtPlayer />
        </div>
    );
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
