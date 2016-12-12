'use strict';

const services = require('simple-services');


module.exports = log;


function log(req, res, next) {
    services.logger.info(`${req.method} ${req.originalUrl}`);

    next();
}