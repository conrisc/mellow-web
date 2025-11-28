import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { musiqWebsocket } from 'Services/musiqWebsocket';
import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';

interface MusiqProps {
	setOnline: () => void;
	setOffline: () => void;
}

function MusiqX({ setOnline, setOffline }: MusiqProps) {
	// const webSocket = useRef(musiqWebsocket.getInstance({ setOnline, setOffline }));

	useEffect(() => {
		document.querySelector('#manifest-placeholder')?.setAttribute('href', '/manifest-musiq.json');
		// webSocket.current.open();

		// return () => {
		//     webSocket.current.close();
		// }
	}, []);

	return (
		<div>
			<TopPanel />
			<MainView />
			{/* <BottomPanel /> */}
		</div>
	);
}

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		setOnline: () => dispatch({ type: 'SET_ONLINE' }),
		setOffline: () => dispatch({ type: 'SET_OFFLINE' }),
	};
};

export const Musiq = connect(mapStateToProps, mapDispatchToProps)(MusiqX);
