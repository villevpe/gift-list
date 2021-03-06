const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const autoprefixer = require('autoprefixer');


module.exports = {
    entry: [
        path.resolve(__dirname, './src/index.ts')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            styles: path.resolve(__dirname, 'src/styles')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: { transpileOnly: true, appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loader: 'tslint-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: true,
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader',
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    postcss: [
                        autoprefixer({
                            browsers: ['last 4 versions']
                        })
                    ]
                }
            },
            {
                test: /\.s[a|c]ss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=[name].[ext]&publicPath=./'
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
