const path = require('path');
const webpack = require('webpack');

module.exports = {
    // The target should be set to "node" to avoid packaging built-ins.
    target: 'node',
    node: {
        __dirname: false // fixes issue with server.js __dirname pointing to fs root
    },
    entry: './src/server/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'server.js',
        // Outputs node-compatible modules instead of browser-compatible.
        libraryTarget: 'commonjs2'
    },
     resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.server.json'
                }
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loader: 'tslint-loader'
            }
        ]
    },
    performance: {
        hints: false
    },
    // Avoids bundling external dependencies, so node can load them directly from node_modules/
    externals: Object.keys(require('./package.json').dependencies),
    devtool: '#source-map',
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
