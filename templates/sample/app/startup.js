'use strict';

const services = require('simple-services');
const logger = require('solid-logger-js');
const Promise = require('bluebird');
const constants = require('./constants');
const grasshopperService = require('./services/grasshopper.service');

module.exports = startup;

function startup(configs) {
    services.register('configs', configs);
    services.register('constants', constants);
    services.register('logger', logger.init(configs.logger));

    return Promise.join(grasshopperService(configs)).spread((grasshopper) => {
        services.register('grasshopper', grasshopper);
    });
}
