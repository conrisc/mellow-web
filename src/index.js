import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import './exampleScript';
import { App } from './components/App.jsx';

console.log('index.js has been loaded');

const appContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(App), appContainer);

if (module.hot) {
  module.hot.accept();
}