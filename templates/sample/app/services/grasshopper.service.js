'use strict';

const api = require('grasshopper-api');
const BB = require('bluebird');
const expressively = require('expressively');
const services = require('simple-services');


module.exports = grasshopperService;


function grasshopperService(configs) {
    const grasshopper = api(configs.grasshopper);

    services.logger.debug('grasshopper service called');

    return new BB(function(resolve, reject) {
        grasshopper
            .core.event.channel('/system/db')
            .on('start', function(payload, next){
                services.logger.debug('starting grasshopper');
                grasshopper.core.auth('basic', {
                    username: configs.admin.username,
                    password: configs.admin.password
                })
                    .then(function(token) {
                        services.logger.debug('grasshopper authenticated');
                        resolve({
                            authenticatedRequest: grasshopper.core.request(token),
                            grasshopper: grasshopper
                        });
                        next();
                    })
                    .catch(reject);
            });

        grasshopper
            .core.event.channel('/type/*')
            .on('save', function(kontx, next) {
                expressively.clearCache()
                    .then(function() {
                        next();
                    });
            });

        grasshopper
            .core.event.channel('/content/*')
            .on('save', function(kontx, next) {
                expressively.clearCache()
                    .then(function() {
                        next();
                    });
            });
    });
}