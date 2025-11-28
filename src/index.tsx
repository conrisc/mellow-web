import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import '@fortawesome/fontawesome-free/js/brands.js';
import '@fortawesome/fontawesome-free/js/solid.js';
import '@fortawesome/fontawesome-free/js/fontawesome.js';
import '@fortawesome/fontawesome-free/js/regular.js';

import './index.css';

import './exampleScript';
import { App } from './components/App';
import { AuthProvider } from './contexts/AuthContext';

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
		<AuthProvider>
			<App />
		</AuthProvider>
	</ConfigProvider>
);

// @ts-ignore
if (module.hot) {
	// @ts-ignore
	module.hot.accept();
}
