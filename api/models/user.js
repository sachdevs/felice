var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    //Spotify user Id: id
    userId: {
        type: String,
        index: {
            unique: true
        }
    },
    //Spotify name: (display_name)
    name: String,
    email: String,//:email
    spotifyURI: String,//:external_urls.spotify
    //dp image url
    imageUrl: String,//:images.0.url
    country: String,//:country
    //Top ten genres
    genreList: [String],
    watchingList: [String]
});
module.exports = mongoose.model('User', UserSchema);
