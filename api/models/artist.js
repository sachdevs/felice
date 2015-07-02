var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArtistSchema = new Schema({
    name: String,
    artistId: {
        type: String,
        index: {
            unique: true
        }
    },
    followers: Number,
    popularity: Number,
    genreList: [String],
    imageUrl: String
});
module.exports = mongoose.model('Artist', ArtistSchema);