var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SongSchema = new Schema({
    songId: String,
    genre: String,
    artist: String,
    artistId: String,
    popularity: String,
    similar: [String]
});
module.exports = mongoose.model('Song', SongSchema);
