var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var distance = require('google-distance');
require('dotenv').config('../')
var app = express();
distance.apiKey = process.env.GOOGLE_KEY;


router.route('/').post(function (req, res) {
    var lat = req.body.lat;
    var lng = req.body.lng;
    var query = req.body.query;
    var config = require('../config/search/reversegeocode')
    var reqOptions = config(lat, lng)
    request(reqOptions)
        .then(function (body) {
            body = body.results[0].address_components
            for( var prop in body){

                if(body[prop].types[0] == "locality" ){
                    break;
                }
            }
            var locality = body[prop].long_name;
            res.redirect(307,'/search/'+locality);
        })
        .catch(function (err) {
            console.log(errr)
        });


});

router.route('/:locality').post(function (req, res) {
   var locality = req.params.locality.toLowerCase();
   var config = require('../config/search/check-city');
   var reqOptions = config(locality);
   request(reqOptions)
       .then(function (body) {
           if(body.length === 0){
               res.send("City Not Found"+ locality).status(404);
           }
           else {
               res.redirect(307,'/search/'+locality+'/query');
           }
       })
       .catch(function (err) {
           console.error(err);
       })
});
router.route('/:locality/query').post(function (req, res) {
    var lat = req.body.lat;
    var lng = req.body.lng;
    var query = req.body.query;
    query = query.trim();
    var locality = req.params.locality.toLowerCase();
    if(!query){
        res.redirect(307,'/search/'+locality+'/all');
    }
    var resSearch =require ('../config/search/res-search');
    var resOptions = resSearch(locality);
    request(resOptions)
        .then(function (body) {
            res.send(body);
        })
        .catch(function (err) {
            console.log(err);
        })
});


module.exports = router;
