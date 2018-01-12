var express = require('express');
var passport = require('passport');
var facebook = require('passport-facebook');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();



router.route("/username").post(function (req, res) {
    var username = req.body.user;
    var pass = req.body.password;
    var options = require('./../config/signup/username-signup');
    var optionsBody = options(username, pass);
    request(optionsBody)
        .then(function (body) {
            res.send(body);
        })
        .catch(function (err) {
           if(err.error.message === 'This user already exists'){
               res.send("Username already exist: Try a new one");
           }
            if(err.error.message === 'Minimum password length is 8 characters'){
                res.send("Minimum Password length is 8");
            }
            else {
                res.send("Somethin error happened!!")
            }
        });
});

module.exports = router;