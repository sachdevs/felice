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

router.get('/:userId', function(req, res) {
    User.find({
        userId: req.params.userId
    }).exec(function(err, users) {
        if (err)
            return res.send(err);
        else if (users.length === 0)
            res.status(404).json({
                msg: 'Not found'
            });
        res.json(users[0]);
    });
});

router.get('/', function(req, res) {
    listUsers(function(obj) {
        res.json(obj);
    });
});

/**
 *  TODO
 */
router.post('/', function(req, res) {
    var user = new User();
    user.userId = req.body.userId;
    user.name = req.body.name;
    user.genreList = req.body.genreList;
    user.save(function(err) {
        if (err)
            return res.send(err);
        else
            res.json(req.body);
    });
});

/**
 *  TODO
 */
router.put('/:userId', function(req, res) {
    User.find({
        userId: req.params.userId
    }).exec(function(err, users) {
        if (err)
            return res.send(err);
        else if (users.length === 0) {
            return res.status(404).json({
                msg: 'Not found'
            });
        }
        var user = users[0];
        user.userId = req.body.userId;
        user.name = req.body.name;
        user.genreList = req.body.genreList;
        user.save(function(err) {
            if (err)
                return res.send(err);
            else
                res.status(200).json(req.body);
        });
    });
});

router.delete('/:userId', function(req, res) {
    User.find({
        userId: req.params.userId
    }).exec(function(err, users) {
        if (err)
            return res.status(400).send(err);
        else if (users.length === 0) {
            return res.status(404).json({
                msg: 'Not found'
            });
        }
        User.remove({
            userId: req.params.userId
        }, function(err) {
            if (err)
                return res.status(400).send(err);
            res.json({
                msg: 'User has been deleted'
            });
        });
    });
});

module.exports = router;