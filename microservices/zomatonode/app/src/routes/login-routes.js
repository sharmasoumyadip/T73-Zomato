var express = require('express');
var passport = require('passport');
var facebook = require('passport-facebook');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();

router.route('/username').post(function (req, res) {
    var username = req.body.user;
    var pass = req.body.password;
    var options = require('./../config/login/username-login');
    var optionsBody = options(username, pass);
    request(optionsBody)
        .then(function (body) {
            res.send(body);

        })
        .catch(function (err) {
            res.send(err);
        })
});

module.exports = router;