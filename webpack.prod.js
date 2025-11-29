const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
	mode: 'production',
	devtool: false, // Disable source maps in production
	module: {
		rules: [
			{
				test: /\.(less|css)$/,
				use: [
					MiniCssExtractPlugin.loader, // Extract CSS to separate files in production
					'css-loader',
				],
			},
		],
	},
	optimization: {
		usedExports: true, // Enable tree shaking
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				// Separate vendor bundle for node_modules
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					priority: 10,
				},
				// Separate bundle for Ant Design
				antd: {
					test: /[\\/]node_modules[\\/]antd[\\/]/,
					name: 'antd',
					priority: 20,
				},
				// Separate bundle for React and React-DOM
				react: {
					test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
					name: 'react',
					priority: 20,
				},
			},
		},
		minimize: true,
	},
	plugins: [
		new webpack.EnvironmentPlugin(['MELLOV_API_URL', 'MELLOV_WEBSOCKET_URI', 'YELLOW_API_URL']),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{
				from: 'public',
				globOptions: {
					ignore: ['**/index.html'], // Exclude index.html (handled by HtmlWebpackPlugin)
				},
			}]
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),
		// Only generate report when ANALYZE env variable is set
		...(process.env.ANALYZE ? [new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			reportFilename: 'bundle-report.html',
			openAnalyzer: true,
		})] : []),
	],
});
