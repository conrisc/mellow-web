import React from 'react';
import ReactDOM from 'react-dom';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

import './index.css';

import './exampleScript';
import { App } from './components/App.jsx';

console.log('index.js has been loaded');

const appContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(App), appContainer);

if (module.hot) {
  module.hot.accept();
}