var express = require('express');
var passport = require('passport');
var facebook = require('passport-facebook').Strategy;
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var app = express();
var configFB = require('./../config/facebook-strategy')
passport.use(new facebook(
    //configFB('https://zomatonode.bodybuilder89.hasura-app.io/signup/facebook'),
    configFB('http://localhost:8000/signup/facebook'),
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, [profile,accessToken]);
    }));
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


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
router.route('/fbsignup').get(function (req, res) {
    var form="<form method= 'post' action='/signup/fbauth'><button type='submit'>FB SIGNUP </button></form>";
    res.send(form);
});

router.route('/fbauth').post(
    passport.authenticate('facebook')
);

router.route('/facebook').get(
    passport.authenticate('facebook', { failureRedirect: '/fbauth' }),
    function(req, res) {
        var token = req.user[1];
        var options = require('./../config/signup/username-facebook');
        var requestOptions = options(token);
        request(requestOptions)
            .then(function (body) {
                res.send(body);
            })
            .catch(function (err) {
                res.send(err);
            });
    });
module.exports = router;