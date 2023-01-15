const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new webpack.EnvironmentPlugin(['MELLOV_API_URL', 'MELLOV_WEBSOCKET_URI']),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{
				from: 'public'
			}]
		}),
	],
});
