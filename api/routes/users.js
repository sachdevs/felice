var express = require('express'),
    mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            userMap[user._id] = user;
        });

        res.json(userMap);
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

module.exports = router;
