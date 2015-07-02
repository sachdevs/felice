var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArtistSchema = new Schema({
    name: String,
    artistId: String,
    followers: Number,
    popularity: Number,
    genres: [String],
    imageUrl: String
});
module.exports = mongoose.model('Artist', ArtistSchema);