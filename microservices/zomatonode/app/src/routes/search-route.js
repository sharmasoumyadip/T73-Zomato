var express = require('express');
var passport = require('passport');
var facebook = require('passport-facebook').Strategy;
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();


router.route('/').post(function (req, res) {
    res.send(req.body);
});
module.exports = router;
