function getPlaylistGenres (tracklist, access_token, callback) {
	album_ids = getAlbumIds(tracklist.items);
	genreList = [];
	for(var i = 0; i < album_ids.length; i++){
		(function(genres, i){
			getGenreHelper(album_ids[i], access_token, function(genres) {
				genreList = genreList.concat(genres);
				if(i == album_ids.length-1){
					callback(genreList);
				}
			});
		})(genreList, i);
	}
}

function getGenreHelper(album_ids, access_token, callback){
	$.ajax({
        url: 'https://api.spotify.com/v1/albums/?ids='+album_ids,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(genres) {
        	//TODO these are not actually genres.
            callback(genres);
        }
    });
}

function getAlbumIds (tracklist) {
	album_ids = [];
	for(var j = 0; j < Math.ceil(tracklist.length/20); j++){
		album_id = "";
		//TODO fix these iterations
		amountLeft = 20;
		if(j === (Math.ceil(tracklist.length/20)-1)){
			amountLeft = tracklist.length%20;
		}
		for(var i = j*20; i < (j*20)+amountLeft; i++){
			if (i !== ((j*20)+amountLeft-1))
				album_id += tracklist[i].track.album.id + ",";
			else
				album_id += tracklist[i].track.album.id;
		}
		album_ids.push(album_id);
	}
	console.log(album_ids);
	return album_ids;
}

// function getEchonestGenres(spotify_id, callback){
//     $.getJSON('http://developer.echonest.com/api/v4/song/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&track_id=spotify:track:'+spotify_id+'&bucket=song_type&callback=?', function(res) {
//         console.log(res.response.songs[0].song_type);
// 	});
// }