const CACHE_NAME = 'justsome-cache';

// List of files which are store in cache.
let filesToCache = [
    '/',
    '/manifest.json'
];

self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(filesToCache);
        }).catch(function (err) {
            // Snooze errors...
            // console.error(err);
        })
    );
});

self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        fetch(evt.request).catch(function () {
            return caches.match(evt.request);
        })
    );
});
