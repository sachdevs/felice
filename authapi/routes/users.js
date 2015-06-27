var express = require('express'),
	mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({msg: 'respond with a resource'});
});

router.post('/', function(req, res){
	res.json({msg: 'u dun goofed'});
	// var user = new User();
	// user.userId = req.body.userId;
	// user.name = req.body.name;
	// user.genreList = req.body.genreList;
	// user.save(function(err){
	// 	if(err)
	// 		res.json({msg: 'u dun goofed'});
	// 	else
	// 		res.json(req.body);
	// });
});

module.exports = router;
