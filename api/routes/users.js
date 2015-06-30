var express = require('express'),
	mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({msg: 'respond with a resource'});
});

router.post('/', function(req, res){
	var user = new User();
	user.userId = req.body.userId;
	user.name = req.body.name;
	user.genreList = ["hi", "hii"];
	user.save(function(err){
		if(err)
			res.send(err);

		res.json({msg: "hi"});
		// res.json(user);
	});
});

module.exports = router;
