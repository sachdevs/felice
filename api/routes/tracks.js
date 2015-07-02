var express = require('express'),
    mongoose = require('mongoose');
var Track = require('../models/track');
var router = express.Router();

/* GET tracks listing. */

function listTracks(done) {
    Track.find({}, function(err, tracks) {
        if (err)
            return err;

        var trackMap = {};

        tracks.forEach(function(track) {
            trackMap[track._id] = track;
        });

        return done(trackMap);
    });
}

router.get('/:trackId', function(req, res) {
    Track.find({
        trackId: req.params.trackId
    }).exec(function(err, tracks) {
        if (err)
            return res.send(err);
        else if (tracks.length === 0)
            res.status(404).json({
                msg: 'Not found'
            });
        res.json(tracks[0]);
    });
});

router.get('/', function(req, res) {
    listTracks(function(obj) {
        res.json(obj);
    });
});

/**
 *  TODO
 */
router.post('/', function(req, res) {
    var track = new Track();
    track.trackId = req.body.trackId;
    track.name = req.body.name;
    track.genreList = req.body.genreList;
    track.save(function(err) {
        if (err)
            return res.send(err);
        else
            res.json(req.body);
    });
});

/**
 *  TODO
 */
router.put('/:trackId', function(req, res) {
    Track.find({
        trackId: req.params.trackId
    }).exec(function(err, tracks) {
        if (err)
            return res.send(err);
        else if (tracks.length === 0) {
            return res.status(404).json({
                msg: 'Not found'
            });
        }
        var track = tracks[0];
        track.trackId = req.body.trackId;
        track.name = req.body.name;
        track.genreList = req.body.genreList;
        track.save(function(err) {
            if (err)
                return res.send(err);
            else
                res.status(200).json(req.body);
        });
    });
});

router.delete('/:trackId', function(req, res) {
    Track.find({
        trackId: req.params.trackId
    }).exec(function(err, tracks) {
        if (err)
            return res.status(400).send(err);
        else if (tracks.length === 0) {
            return res.status(404).json({
                msg: 'Not found'
            });
        }
        Track.remove({
            trackId: req.params.trackId
        }, function(err) {
            if (err)
                return res.status(400).send(err);
            res.json({
                msg: 'Track has been deleted'
            });
        });
    });
});

module.exports = router;