'use strict';

var q = require('q'),
    os = require('os'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    steps = require('../steps'),
    db = require('../utils/mongo'),
    output = require('../utils/output'),
    logger = require('../utils/logger'),
    inquirer = require('inquirer'),
    guid = require('../utils/guid');

module.exports = function(){
    var questions = [{
            type: 'list',
            name: 'start',
            message: 'Do you want to continue?',
            choices: ['Yes', 'No']
        }],
        validate = require('../validate');


    logger.statement('Automated Grasshopper setup. A fresh Grasshopper application will be created in this directory.\n' +
        'To ensure that this process goes smoothly please review the prerequisites: https://github.com/Solid-Interactive/grasshopper-cli ');

    inquirer.prompt(questions, function( answers ) {
        var appName = process.cwd().substr((process.cwd().lastIndexOf(path.sep) + 1), (process.cwd().length - process.cwd().lastIndexOf(path.sep))),
            appId = appName.toLowerCase().replace(/ /g,''),
            config = {
                project: {
                    home: process.cwd(),
                    name: appName,
                    main: 'app/' + appId + '.js',
                    installExpress: true,
                    port: 3008,
                    id: appId
                },
                admin: {
                    buildDirectory : path.join('app', 'public', 'admin'),
                    apiEndpoint : '',
                    base : '/admin/',
                    username: 'app-do-not-delete',
                    password: '1q2w3e4r'
                    // @TODO remember to put these credentials in the output at the end, after the app starts
                },
                crypto: {
                    secret: guid()
                },
                assets: {
                    default : 'local',
                    tmpdir : path.join(process.cwd(), 'tmp'),
                    engines: {
                        local : {
                            path : path.join(process.cwd(), 'app', 'public', 'assets'),
                            urlbase : 'http://locahost:3000'
                        }
                    }
                },
                logger: {
                    adapters: [{
                        type: 'console',
                        application: appName,
                        machine: os.hostname()
                    }]
                },
                identities: {},
                aws: {
                    enabled: false,
                    bucket: '',
                    region: '',
                    accessKeyId: '',
                    secretAccessKey: ''
                    //@TODO work this into the initial prompts
                },
                mandrill: {
                    enabled: false,
                    to: '',
                    from: '',
                    apiKey: '',
                    subAccount: ''
                    //@TODO work this into the initial prompts
                },
                db: db.buildConfig('mongodb://localhost/' + appId)
            };
        
        if(process.platform === 'win32'){
            config.admin.buildDirectory = config.admin.buildDirectory.replace(/\\/g,'\\\\');
            config.assets.tmpdir = config.assets.tmpdir.replace(/\\/g,'\\\\');
        }
        
        if(answers.start === 'Yes'){
            writePackageJson(config)
                .then(writeAdminConfig)
                .then(validate.hasPackageFile)
                .then(steps.scaffolding)
                .then(writeAppConfigs)
                .then(steps.npms)
                .then(installAdmin)
                .then(db.createSampleData)
                .then(startApp)
                .then(function(results){
                    output.setupCompleted();
                })
                .catch(function(err){
                    logger.error('');
                    logger.error('Setup failed!');
                    logger.error('Reason: ' + err.message);
                });
        }
        else {
            logger.notice('');
            logger.notice('Quit without installing.');
        }
    });
};

function writePackageJson(config){
    var tpl = _.template(
            fs.readFileSync(path.join(__dirname, '../../templates/package.tpl'), 'utf-8')),
        output = tpl(config),
        deferred = q.defer();

    fs.writeFile(path.join(config.project.home, 'package.json'), output, 'utf-8', function(err){
        if(err){
            throw err;
        }
        deferred.resolve(config);
    });

    return deferred.promise;
}

function writeConfig(config){
    var tpl = _.template(
            fs.readFileSync(path.join(__dirname, '../../templates/core.tpl'), 'utf-8')),
        output = tpl(config),
        deferred = q.defer();

    fs.writeFile(path.join(config.project.home, 'grasshopper-config.json'), output, 'utf-8', function(err){
        if(err){
            throw err;
        }
        deferred.resolve(config);
    });

    return deferred.promise;
}

function writeAppConfigs(config) {
    var tpl = _.template(fs.readFileSync(path.join(__dirname, '../../templates/config.json.tpl'), 'utf-8')),
        output = tpl(config),
        deferred = q.defer();

    fs.writeFile(path.join(config.project.home, 'app', 'configs', 'vars', 'local.json'), output, 'utf-8', function(err) {
        if(err){
            throw err;
        }
        deferred.resolve(config);
    });

    return deferred.promise;
}

function writeAdminConfig(config){
    var tpl = _.template(
            fs.readFileSync(path.join(__dirname, '../../templates/admin.tpl'), 'utf-8')),
        output = tpl(config),
        deferred = q.defer();

    fs.writeFile(path.join(config.project.home, 'gha.json'), output, 'utf-8', function(err){
        if(err){
            throw err;
        }
        deferred.resolve(config);
    });

    return deferred.promise;
}

function installAdmin(config){
    var exec = require('child_process').exec,
        cmd = path.join(config.project.home, './node_modules/.bin/grasshopper build'),
        child = exec(cmd, function(err, stdout, stderr){
            if(err) {
                console.log('exec error: ' + err);
            }
        }),
        progress = output.progress({label: 'Building grasshopper-admin. Please wait, this can take a few minutes.'}),
        deferred = q.defer();

    logger.trace('');
    logger.trace('RUNNING: ' + cmd);

    progress.start();

    child.on('error', function(err){
        deferred.reject(err);
    });

    child.on('close', function(code){
        if(code === 0){
            progress.complete();
            deferred.resolve(config);
        }
        else {
            deferred.reject(new Error(code));
        }
    });

    return deferred.promise;
}

function startApp(config) {
    var exec = require('child_process').exec,
        cmd = path.join(config.project.home, './bin/start'),
        child = exec(cmd),
        deferred = q.defer();

    logger.trace('');
    logger.trace('RUNNING: ' + cmd);

    logger.trace('Browse to your site at: http://localhost:' + config.project.port);
    logger.trace('Get to the admin at: http://localhost:' + config.project.port + '/admin\n' +
        'Credentials are: ' + config.admin.username + ' / ' + config.admin.password + ' (remember to change)');

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
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    return deferred.promise;
}
