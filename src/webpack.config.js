var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: "/app/src",
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./js/client.jsx",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {test: /\.png$/, loader: 'file-loader'},
            {test: /\.svg$/, loader: 'svg-inline?classPrefix'}
            // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader:"url?limit=10000&mimetype=application/font-woff" },
            // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" }
        ]
    },
    output: {
        path: "/wwwroot",
        filename: "client.min.js"
    },
    plugins: debug ? [new HtmlWebpackPlugin({title: "Justin Good"})] : [
        new HtmlWebpackPlugin({title: "Justin Good"}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};
