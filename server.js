const express = require('express');
// const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;


const argsArr = process.argv.slice(2);
const args = {}
for (let arg of argsArr) {
    argSplit = arg.split('=');
    args[argSplit[0].toLowerCase()] = argSplit[1].toLowerCase();
}

const buildFolder = args.mode === 'development' ? 'public' : 'dist';

const app = express();
// app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, buildFolder)));
app.get('/ping', function (req, res) {
    return res.send('pong');
});
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.listen(port, () => console.log(`Yoo-server is listening on ${port}`));