
const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    entry: {
        app: ['./src/index.js', 'webpack-hot-middleware/client'],
        preLoader: './src/preLoader.js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: 'public' }
        ]),
        new webpack.HotModuleReplacementPlugin(),
    ]
});