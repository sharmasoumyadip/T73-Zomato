var express = require('express');
var Promise = require('bluebird');
var request = require('request-promise');
var router = express.Router();
var geodist = require('geodist');
var app = express();


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
    /*var resSearch =require ('../config/search/res-search');
    var resOptions = resSearch(locality);
    request(resOptions)
        .then(function (body) {
            var resDistList = [];
            for(var prop in body){
                resDistList.push({
                   id: body[prop].res_id,
                    dist: geodist({lat: lat, lon: lng}, {lat: body[prop].res_lat, lon: body[prop].res_long}, {exact: true, unit: 'km'})
                });
            }
            resDistList.sort(function (a,b) {
                var x = a.dist < b.dist ? -1 : 1;
                return x;
            });
            res.send(resDistList);
        })
        .catch(function (err) {
            console.log(err);
        }) */
});
router.route('/:locality/all').post(function(req, res) {
    var lat = req.body.lat;
    var lng = req.body.lng;
    var locality = req.params.locality.toLowerCase();
    var config = require('../config/search/check-city');
    var reqOptions = config(locality);
    request(reqOptions)
        .then(function (body) {
            var rest = body[0].res_table;
            var cusine = body[0].cuisine_tbale;
            var rev = body[0].review_table;
            var reqOptions = require('../config/search/search_by_city');
            var request_options = [reqOptions(rest), reqOptions(cusine),  reqOptions(rev)];
            Promise.map(request_options, function (obj) {
                return request(obj)
                    .then(function(body) {
                    return body;
                })
            }).then(function (body) { //body is array JSON fetched from request to above two url
                    var res_json = body[0];
                    var cusine_json = body[1];
                    var rev_json = body[2];
                    var list = [];
                    for(var prop in res_json){
                        var cuisine =[];
                        var review = 0;
                        var reviewers =0;
                        for(var key in cusine_json){
                            if(res_json[prop].res_id === cusine_json[key].res_id){
                                    cuisine.push(cusine_json[key].cuisine);
                            }
                        }
                        for(var revs in rev_json){
                            if(res_json[prop].res_id === rev_json[revs].res_id){
                                review = review + rev_json[revs].stars;
                                reviewers ++;
                            }
                        }
                        if(reviewers !== 0){
                            review = review/reviewers;
                        }
                        if(reviewers === 0){
                            review = 'No Reviews Yet';
                        }
                        list.push({
                            id: res_json[prop].res_id,
                            name: res_json[prop].res_name,
                            add: res_json[prop].res_add,
                            city: locality,
                            rev: review,
                            cuisinie: cuisine,
                            dist: geodist({lat: lat, lon: lng}, {lat: res_json[prop].res_lat, lon: res_json[prop].res_lng}, {exact: true, unit: 'km'})

                        })
                    }
                    res.send(list);
            }).catch(function (err) {
                res.send("OOPS! Something Went Wrong");
            });
        });
});

module.exports = router;
