const PATH = '/service-worker.js';

let isServiceWorkersSupport = ('serviceWorker' in navigator);

if (isServiceWorkersSupport) {
    console.log('Will service worker register?')
    navigator.serviceWorker.register(PATH).then(function () {
        console.log('Yes it did.')
    }).catch(function (err) {
        console.log('No it didn\'t. This happened: ', err)
    });
} else {
    console.log('Service worker is not supported or you are not using HTTPS');
}