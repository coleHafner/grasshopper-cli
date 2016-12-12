'use strict';

const _ = require('lodash');
const services = require('simple-services');
const version = require((require('expressively').configs.projectIsInAppDir ? '../' : '') + '../package.json').version;


module.exports = extendResLocals;


function extendResLocals(req, res, next) {
    _.extend(res.locals, {
        constants: services.constants,
        version: version,
        preloadedData: {},
        user: req.verifiedAuthToken || null
    });

    next();
}