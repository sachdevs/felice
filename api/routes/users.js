var express = require('express'),
    mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */

function listUsers(done) {
    User.find({}, function(err, users) {
        if (err)
            return err;

        var userMap = {};

        users.forEach(function(user) {
            userMap[user._id] = user;
        });

        return done(userMap);
    });
}

function findById(id, done) {
    User.find({
        userId: id
    }).exec(function(err, user) {
        if (err)
            return err;
        return done(user[0]);
    });
}

router.get('/:userId', function(req, res) {
    findById(req.params.userId, function(obj) {
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
    findById(req.params.userId, function(obj) {
        if(obj === undefined) {
		   res.statusCode = 404;
		   res.json({msg: 'Not found'});
		}
		console.log(obj);
        User.remove({
            userId: req.params.userId
        }, function(err) {
            if (err)
                res.send(err);
            res.json({
                msg: 'User has been deleted'
            });
        });
    });
});

module.exports = router;
