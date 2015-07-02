var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrackSchema = new Schema({
    name: String,
    trackId: String,
    genre: String,
    artist: String,
    artistId: String,
    album: String,
    popularity: String,
    duration_ms: Number,
    explicit: Boolean,
    preview_url: String,
    similar: [String]
});
module.exports = mongoose.model('Track', TrackSchema);
