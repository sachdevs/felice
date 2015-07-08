var express = require('express'),
    mongoose = require('mongoose');
var User = require('../models/user'),
    secret = require('../secret').key;
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function(req, res) {
    if (req.body.name !== "Saksham") {
        return res.status(403).json({
            msg: 'dun goofed'
        });
    }
    else {
        var token = jwt.sign(req.body.name, secret, {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        res.json({
            success: true,
            message: '24h token issued',
            token: token
        });
    }
});

module.exports = router;
