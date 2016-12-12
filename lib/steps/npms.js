'use strict';

var q = require('q'),
    _ = require('lodash'),
    output = require('../utils/output'),
    logger = require('../utils/logger');

module.exports = function(config){
    var deferred = q.defer(),
        progress = output.progress({label: 'Installing grasshopper-api'}),
        packages = {
            "grasshopper-admin": "^0.40.3-no-minification",
            "grasshopper-api": "^0.18.20",
            "expressively": "^1.1.3",
            "app-state": "^2.0.1",
            "node-sass-middleware": "^0.10.0",
            "nodemon": "^1.11.0",
            "path": "^0.12.7",
            "pugify": "^2.1.0",
            "simple-services": "^0.1.0"
        };

    progress.start();

    install('grasshopper-api').then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing grasshopper-admin'});
            progress.start();
            return install('grasshopper-admin');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing expressively'});
            progress.start();
            return install('expressively');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing app-state'});
            progress.start();
            return install('app-state');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing node-sass-middleware'});
            progress.start();
            return install('node-sass-middleware');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing nodemon'});
            progress.start();
            return install('nodemon');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing path'});
            progress.start();
            return install('path');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing pugify'});
            progress.start();
            return install('pugify');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing simple-services'});
            progress.start();
            return install('simple-services');

        }).then(function() {
            progress.complete();
            progress = output.progress({label: 'Installing compression'});
            progress.start();
            return install('compression');

        }).catch(function(err) {
            logger.error('Could not install PACKAGE. Error: ' + err.message);
            throw err;

        }).finally(function() {
            progress.complete();
            deferred.resolve(config);
        });

        return deferred.promise;
};

function install(name){
    var exec = require('child_process').exec,
        cmd = 'npm install ' + name + ' --save',
        child = exec(cmd),
        deferred = q.defer();

    logger.trace('');
    logger.trace('RUNNING: ' + cmd);

    child.on('error', function(err){
        deferred.reject(err);
    });

    child.on('close', function(code){
        if(code === 0){
            deferred.resolve();
        }
        else {
            deferred.reject(new Error(code));
        }
    });

    return deferred.promise;
}