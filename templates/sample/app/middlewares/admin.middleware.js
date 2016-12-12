'use strict';

const template = require.resolve('../public/admin/index.html');


module.exports = admin;


function admin(req, res) {
    res.sendFile(template);
}
