var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrackSchema = new Schema({
    name: String,
    trackId: {
        type: String,
        index: {
            unique: true
        }
    },
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
