{
    "projectIsInAppDir": true,
    "useSassMiddleware": true,
    "debug": false,
    "optimize": false,
    "port": <%= project.port %>,
    "verbose": true,
    "protocol": "http",
    "domain": "localhost",
    "cookieDomain": "<%= project.cookieDomain %>",

    "admin": {
        "username": "<%= admin.username %>",
        "password": "<%= admin.password %>"
    },

    "db": {
        "endpoint": "<%= db.host %>",
        "host": "<%= db.host %>",
        "name": "<%= db.name %>",
        "username": "<%= db.username %>",
        "password": "<%= db.password %>"
    },
    "aws": {
<% if (aws.enabled === true) { %>
        "enabled": true,
        "accessKeyId": "<%= aws.accessKeyId %>",
        "bucket": "<%= aws.bucket %>",
        "region": "<%= aws.region %>",
        "secretAccessKey": "<%= aws.secretAccessKey %>",
        "urlbase": "https://s3.amazonaws.com/"
<% }else { %>
        "enabled": false
<% } %>
    },
    "mandrill" : {
<% if (mandrill.enabled === true) { %>
        "enabled": true,
        "apiKey": "<%= mandrill.apiKey %>",
        "subAccount": "<%= mandrill.subAccount %>",
        "to": "<%= mandrill.to %>",
        "from": "<%= mandrill.from %>"
<% }else { %>
        "enabled": false
<% } %>
    }
}