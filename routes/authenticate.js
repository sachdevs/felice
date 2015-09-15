var express = require('express'),
    mongoose = require('mongoose'),
    querystring = require('querystring'),
    request = require('request');
var User = require('../models/user'),
    secret = require('../secrets').key,
    client_secret = require('../secrets').secret;
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function(req, res) {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            //!!! change when deploying
            code: req.body.code,
            redirect_uri: "http://10.71.4.82:3000/",
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer('c9ce30f810254abfa32846f44b5533cf' + ':' + client_secret).toString('base64'))
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;
            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                json: true
            };
            var admins = '12183851229'
            var admin = false;
            var token = jwt.sign(body.access_token, secret, {
                expiresInMinutes: 1440 // expires in 24 hours
            });
            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                if (body.id === admins)
                    admin = true;
                res.status(200).json({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    local_token: token,
                    local_token_time: 1440,
                    admin: admin,
                    body: body
                });
            });
        }
        else {
            return res.status(403).json({
                msg: "dun goofed"
            });
        }
    });
});

module.exports = router;
