'use strict';

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_DIR = path.resolve(__dirname, 'frontend/game');

// only game page (react + socket.io)
module.exports = {
    context: __dirname + '/frontend/game',

    entry: {
        game: "./app.jsx",
        common: "./common.jsx"
    },

    output: {
        path: './dist',
        filename: "[name].js",
        library: "[name]"
    },

    watch: NODE_ENV == 'development',

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        })
    ],

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },
    resolveLoaders: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader'],
        extensions: ['', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel'
            }
        ]
    }
};

if (NODE_ENV == 'prod') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                unsafe: true
            }
        })
    )
}