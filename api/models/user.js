var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    //Spotify user Id
    userId: {
        type: String,
        index: {
            unique: true
        }
    },
    //Spotify name
    name: String,
    //Top ten genres
    genreList: [String]
});

module.exports = mongoose.model('User', UserSchema);
