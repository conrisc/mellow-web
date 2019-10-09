const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');
const path = require('path');

const port = process.env.PORT || 8080;

const argsArr = process.argv.slice(2);
const args = {}
for (let arg of argsArr) {
    argSplit = arg.split('=');
    args[argSplit[0].toLowerCase()] = argSplit[1].toLowerCase();
}

const isInProductionMode = args['mode'] === 'production';
const config = isInProductionMode ? require('./webpack.prod') : require('./webpack.dev');
const compiler = webpack(config);

const app = express();

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

if (!isInProductionMode) {
    app.use(webpackHotMiddleWare(compiler));
    app.get('/ping', function (req, res) {
        return res.send('pong');
    });
}

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', function (req, res) {
    console.log(req.originalUrl);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server is listening on ${port}`));