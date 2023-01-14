import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'antd/dist/antd.less';

import './index.css';

import './exampleScript';
import { App } from './components/App';
import { ApiClient } from 'mellov_api';
import { MELLOV_API_URL } from 'Constants/environment';

ApiClient.instance.basePath = MELLOV_API_URL;

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

const appContainer = document.querySelector('#app');
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	appContainer
);

if (module.hot) {
	module.hot.accept();
}
