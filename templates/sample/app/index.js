'use strict';

const env = process.env.NODE_ENV;
const configs = require('./configs')(env);
const express = require('express');
const compression = require('compression');
const expressively = require('expressively');
const path = require('path');

const app = express();

app.use(compression());

if (configs.useSassMiddleware) {

    const nodeSassMiddleware  = require('node-sass-middleware');

    app.use('/css', nodeSassMiddleware({
        src : __dirname,
        dest : path.join(__dirname, 'public', 'css'),
        debug : true,
        includePaths : ['node_modules'],
        outputStyle : 'compressed',
        sourceMap : true,
        error : error => {
            console.log('error', error);
        }
    }));
}

expressively.start({
    app: app,
    configs: configs,
    baseDirectory: __dirname,
    express: express,
    verbose: configs.verbose
});