var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = new Schema({
	//Spotify user Id
	userId: String,
	//Spotify name
	name: String,
	//Top ten genres
	genreList: [String]
});

mongoose.model('User', User);
