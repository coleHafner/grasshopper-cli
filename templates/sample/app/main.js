'use strict';

var services = require('simple-services'),
    constants = require('./constants'),
    appState = require('app-state');

// load and set initial data templated into dom
appState('', getPreloadedDataUtil(constants.viewIds.preloadedDataScript));

// register services for all views to reference
services.register('constants', constants);
services.register('appState', appState.init());