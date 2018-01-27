var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();

router.route('/').get(function (req, res) {
    var reqOpt = {
        url: 'https://auth.bodybuilder89.hasura-app.io/v1/user/info',
        method: 'GET',
        "headers": {
            "Content-Type": "application/json"
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