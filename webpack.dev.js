const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
		host: '0.0.0.0',
		historyApiFallback: true,
		// https: true,
		client: {
			overlay: true,
			progress: true,
		},
	},
	plugins: [
		new Dotenv({
			path: `./.env.development`,
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([{ from: 'public' }]),
	],
	watchOptions: {
		poll: true,
	},
});
