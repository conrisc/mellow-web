const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: ['./src/index.tsx'],
		preLoader: './src/preLoader.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		roots: [__dirname],
		alias: {
			Hooks: path.resolve(__dirname, 'src/hooks/'),
			Services: path.resolve(__dirname, 'src/services/'),
			Constants: path.resolve(__dirname, 'src/constants/'),
			Utils: path.resolve(__dirname, 'src/utils/'),
			CommonComponents: path.resolve(__dirname, 'src/components/common/'),
			Types: path.resolve(__dirname, 'src/types/'),
			Contexts: path.resolve(__dirname, 'src/contexts/'),
		},
	},
	module: {
		rules: [
			{
				test: /\.(less|css)$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)$/,
				use: 'file-loader',
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/react',
								'@babel/preset-env',
								{ plugins: ['@babel/plugin-proposal-class-properties'] },
							],
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html',
			chunks: ['app'], // Only include app entry, exclude preLoader
			scriptLoading: 'blocking',
			inject: 'body',
		}),
	],
};
