var express = require('express'),
    mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */

function listUsers() {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            userMap[user._id] = user;
        });

        res.json(userMap);
    });
}

function findById(id) {
    User.findById(id, function(err, obj) {
        if (err)
            return err;
        else
            return obj;
    });
}

router.get('/:userId', function(req, res) {
	res.json(findById(req.params.userId));
});

router.get('/', function(req, res) {
    res.json(listUsers());
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
    var user = findById(req.params.userId);
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

router.delete('/:userId', function(req, res){
	User.findByIdAndRemove(req.params.userId, function(err){
		if(err)
			res.send(err);
		res.json(msg: 'User deleted');
	});
});

module.exports = router;
