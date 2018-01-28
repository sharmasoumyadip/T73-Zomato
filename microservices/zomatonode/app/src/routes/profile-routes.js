var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();

router.route('/').get(function (req, res) {
    var cookiejar = request.jar();
    cookiejar.getCookies('bodybuilder89', 'https://api.mydomain.com');
    var reqOpt = {
        url: 'https://auth.bodybuilder89.hasura-app.io/v1/user/info',
        jar: cookiejar,
        method: 'GET',
        "headers": {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + req.cookies.bodybuilder89
        }
    }
    request(reqOpt)
        .then(function (body) {
            res.send(body);
        })
        .catch(function (err) {
            res.send(err);
        })
});

module.exports = router;