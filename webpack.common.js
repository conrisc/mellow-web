
const path = require('path');

module.exports = {
	entry: {
		app: ['./src/index.ts'],
		preLoader: './src/preLoader.js',
	},
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: path.resolve(__dirname),
        alias: {
            Hooks: 'src/hooks/',
            Services: 'src/services/',
            Constants: 'src/constants/',
            CommonComponents: 'src/components/common/'
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    'primary-color': '#6158c4',
                                    'link-color': '#6158c4',
                                    // 'border-radius-base': '2px',
                                },
                                javascriptEnabled: true,
                            },
                        },
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)$/,
                use: 'file-loader'
            },
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            //     exclude: /node_modules/,
            //     query: {
            //         presets: ['@babel/preset-env']
            //     }
            // },
            // {
            //     test: /\.jsx$/,
            //     loader: 'babel-loader',
            //     exclude: /node_modules/,
            //     query: {
            //         presets: ['@babel/react']
            //     }
            // }
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/react',
                            '@babel/preset-env',
                            { 'plugins': ['@babel/plugin-proposal-class-properties']}
                        ]
                    }
                },
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    }
};