import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import './index.css';

import './exampleScript';
import { App } from './components/App';

const initialState = {
	isAuthenticated: false,
	ytPlayer: null,
	isOnline: false,
};

function reducer(state = initialState, action) {
	switch (action.type) {
		case 'SET_ONLINE':
			return { ...state, isOnline: true };
		case 'SET_OFFLINE':
			return { ...state, isOnline: false };
		case 'SET_YT_PLAYER':
			return { ...state, ytPlayer: action.ytPlayer };
		case 'SET_AUTHENTICATED':
			return { ...state, isAuthenticated: true };
		case 'SET_UNAUTHENTICATED':
			return { ...state, isAuthenticated: false };
		default:
			return state;
	}
}

const store = createStore(reducer);

const appContainer = document.getElementById('app');
const root = createRoot(appContainer);
root.render(
	<ConfigProvider
		theme={{
			token: {
				colorPrimary: '#00b96b',
				colorLink: '#6158c4',
			}
		}}
	>
		<Provider store={store}>
				<App />
		</Provider>
	</ConfigProvider>
);

// @ts-ignore
if (module.hot) {
	// @ts-ignore
	module.hot.accept();
}
