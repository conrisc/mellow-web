const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');
const config = require('./webpack.config');
const path = require('path');

const port = process.env.PORT || 8080;
const compiler = webpack(config);

const argsArr = process.argv.slice(2);
const args = {}
for (let arg of argsArr) {
    argSplit = arg.split('=');
    args[argSplit[0].toLowerCase()] = argSplit[1].toLowerCase();
}

const app = express();
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleWare(compiler));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.listen(port, () => console.log(`Yoo-server is listening on ${port}`));