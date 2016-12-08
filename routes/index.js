var express = require('express');
//var router = express.Router();
var app = express()

var mongodb = require('mongodb');
var shortid = require('shortid');
var validUrl = require('valid-url');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var config = require('../config');
var mLab = 'mongodb://' + config.db.host + '/' + config.db.name;
var MongoClient = mongodb.MongoClient;

module.exports = function(app) {
    

    app.get('/new/:url(*)', function (req, res, next) {
        MongoClient.connect(mLab, function (err, db){
            
            if(err){
                console.log("Connection error", err);
                
            } else{
                console.log("Connection successful");
                var collection = db.collection('links');
                var params = req.params.url;
                var local = req.get('host') + "/";
                
                var newLink = function(db, callback){
                    collection.findOne({"url": params }, {short: 1, _id: 0}, function(err, doc){
                    if(doc != null){
                        res.json({ original_url: params, short_url: doc.short });
                    }
                    else{
                        if(validUrl.isUri(params)){
                            var shortCode = shortid.generate();
                            var newUrl = { url: params, short: shortCode};
                            collection.insert([newUrl]);
                            res.json({original_url: params, short_url: shortCode});
                        } 
                        else{
                           res.json({error: "Invalid url format"});
                        }
                    }
                  });
                };
                
                newLink(db, function(){
                    db.close();
                });
            }
        });
    });
    
    app.get('/:short', function(req, res, next){
        MongoClient.connect(mLab, function (err, db) {
           if (err) {
              console.log("Unable to connect to server", err);
            } 
            else {
              console.log("Connected to server")
 
              var collection = db.collection('links');
              var params = req.params.short;
 
              var findLink = function (db, callback) {
                   collection.findOne({ "short": params }, { url: 1, _id: 0 }, function(err,doc){
                    if( doc != null){
                        res.redirect(doc.url);
                    }
                    else{
                        res.json({ error: "No corresponding shortlink found in the database." });
                    }
                });
              };
 
              findLink(db, function () {
               
                db.close();
              });
 
            };
        });
    });
};

//exports.index = function(req, res){
 // res.render('index', { title: 'Express' });
//};