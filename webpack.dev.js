const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
	mode: 'development',
	entry: {
		app: ['./src/index.js', 'webpack-hot-middleware/client'],
		preLoader: './src/preLoader.js',
	},
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
		historyApiFallback: true,
	},
	plugins: [
		new Dotenv({
			path: `./.env.development`,
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([{ from: 'public' }]),
	],
});
