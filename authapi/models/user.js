var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
	//Spotify user Id
	userId: String,
	//Spotify name
	name: String,
	//Top ten genres
	genreList: [String]
});

mongoose.model('User', UserSchema);