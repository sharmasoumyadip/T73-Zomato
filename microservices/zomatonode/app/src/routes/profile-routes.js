var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();

router.route('/').get(function (req, res) {
    request('https://auth.bodybuilder89.hasura-app.io/v1/user/info')
        .then(function (body) {
            res.send(body);
        })
        .catch(function (err) {
            res.send(err);
        })
});

module.exports = router;