var express = require('express'),
    mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */

function listUsers(done) {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            userMap[user._id] = user;
        });

        return done(userMap);
    });
}

function findById(id, done) {
    User.findById(id, function(err, obj) {
        if (err)
            done(err);
        else{
        	console.log(obj);
            done(obj);
        }
    });
}

router.get('/:userId', function(req, res) {
    findById(req.params.userId, obj, function(obj){
    	console.log("in");
    	res.json(obj);
    });
});

router.get('/', function(req, res) {
    listUsers(function(obj) {
        res.json(obj);
    });
});

router.post('/', function(req, res) {
    var user = new User();
    user.userId = req.body.userId;
    user.name = req.body.name;
    user.genreList = req.body.genreList;
    user.save(function(err) {
        if (err)
            res.send(err);
        else
            res.json(req.body);
    });
});

router.put('/:userId', function(req, res) {
    findById(req.params.userId, function(user) {
        user.userId = req.body.userId;
        user.name = req.body.name;
        user.genreList = req.body.genreList;
        user.save(function(err) {
            if (err)
                res.send(err);
            else
                res.json(req.body);
        });
    });
});

router.delete('/:userId', function(req, res) {
    User.findByIdAndRemove(req.params.userId, function(err) {
        if (err)
            res.send(err);
        res.json({
            msg: 'User deleted'
        });
    });
});

module.exports = router;
