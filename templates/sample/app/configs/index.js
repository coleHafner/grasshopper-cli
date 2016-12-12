'use strict';

module.exports = getConfigs;

function getConfigs(env) {
    const variables = require(`./vars/${ env }`);
    const fullDomain = `${variables.protocol}://${variables.domain}${variables.domain === 'localhost' ? `:${variables.port}/` : '/'}`;

    return {
        admin: variables.admin,
        env: env,
        grasshopper: {
            assets: {
                default: 'amazon',
                engines: {
                    amazon: variables.aws
                }
            },
            crypto: {
                secret_passphrase : ''
            },
            db: {
                type: 'mongodb',
                defaultPageSize: 10000,
                endpoint:  variables.db.endpoint,
                host:  variables.db.host,
                database:  variables.db.name,
                username: variables.db.username,
                password: variables.db.password,
                debug:  variables.debug
            },
            server: {
                proxy: true,
                https: false,
                maxFilesSize : 1000000000
            }
        },
        logger: {
            adapters : [{
                type : 'console',
                application : '',
                machine : 'dev'
            }]
        },
        mandrill : {
            apiKey: variables.mandrill.apiKey,
            domain: fullDomain,
            subAccount: variables.mandrill.subAccount,
            to: variables.mandrill.to,
            from: variables.mandrill.from
        },
        googleApis: variables.googleApis,
        jwtSecret: variables.jwtSecret,
        port: variables.port,
        useSassMiddleware: variables.useSassMiddleware,
        verbose: variables.verbose,
        projectIsInAppDir: variables.projectIsInAppDir,
        fullDomain: fullDomain,
        cookieDomain: variables.cookieDomain
    }
}
