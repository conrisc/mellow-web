console.log('This is the pre loader');

// const API_KEY = 'some key';

// Youtube API
// gapi.load("client");

// setTimeout(() => {
//     loadClient();
// }, 1000);

// function loadClient() {
//     gapi.client.setApiKey(API_KEY);
//     return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
//         .then(() => { console.log("GAPI client loaded for API"); },
//             (err) => { console.error("Error loading GAPI client for API", err); });
// }

// IFrame
window.loadYT = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT)
});
