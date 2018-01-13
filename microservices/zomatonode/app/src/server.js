var express = require('express');
var morgan = require('morgan');
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var session = require('express-session');
var passport = require('passport');
var app = express();

require('request-debug')(request);
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.set('port', 8000);
app.get('/', function (req,res) {
    res.send("   Hello")
});
app.use('/signup', require('./routes/signup-routes'));
app.use('/login', require('./routes/login-routes'));

app.listen(app.get('port'), function () {
    console.log("APP RUNNING ON " + app.get('port'));
});