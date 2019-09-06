import './index.css';

import './exampleScript';

console.log('index.js has been loaded');

const appContainer = document.createElement('div');
appContainer.innerHTML = `
    <p class="example">This is an example text injected using JS.</p>
`;
document.body.appendChild(appContainer);