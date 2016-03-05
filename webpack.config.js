'use strict';

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_DIR = path.resolve(__dirname, 'frontend/game');

// only game page (react + socket.io)
module.exports = {
    context: __dirname + '/frontend/game',

    entry: {
        game: "./app.js"
    },

    output: {
        path: './public/js/build/game/',
        filename: "game_react.js",
        library: "[name]"
    },

    watch: NODE_ENV == 'development',

    plugins: [
        new webpack.NoErrorsPlugin()
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
                test: /\.js?/,
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