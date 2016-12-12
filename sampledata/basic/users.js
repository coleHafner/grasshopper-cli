module.exports = function(ObjectID, config) {
    'use strict';
    var CryptoJS = require('crypto-js'),
        salt = '225384010328',
        password = 'TestPassword';

    if (
        typeof config !== 'undefined' &&
        typeof config.admin !== 'undefined' &&
        typeof config.admin.password !== 'undefined'
    ) {
        password = config.admin.password;
    }

    var hash = CryptoJS.HmacSHA256(password, salt).toString();

    return [
        {
            _id: ObjectID('5246e73d56c02c0744000004'),
            role: 'admin',
            enabled: true,
            firstname: 'Test',
            lastname: 'User',
            displayName : 'admin',
            linkedIdentities : ['basic'],
            email: 'email@email.com',
            identities: {
                basic: {
                    username: config.admin.username,
                    salt: salt,
                    hash: hash
                }
            }
        }
    ];
};