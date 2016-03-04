'use strict';

const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';

// only game page (react + socket.io)
module.exports = {
    context: __dirname + '/frontend/game',

    entry: {
        game: "./app.jsx",
        common: "./common.jsx"
    },

    output: {
        path: './frontend/game',
        filename: "[name].js",
        library: "[name]"
    }
};