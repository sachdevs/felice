var stateKey = 'spotify_auth_state';

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var params = getHashParams();
var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);

if (access_token && (state == null || state !== storedState)) {
    alert("error");
}
else {
    localStorage.removeItem(stateKey);
    if (access_token) {
        getUserProfile(access_token, function(response) {
            getUserTracklist(access_token, function(tracks) {
                getCompiledTemplate('songlist', function(template) {
                    //$('#logged-in').html(userProfileTemplate(response));
                    $('#logged-in').html(template(tracks));
                });
                getPlaylistGenres(tracks, access_token, function(genres){
                	console.log(genres);
                });
            });
        });
        $('#login').hide();
        $('#logged-in').show();
    }
    else {
        $('#login').show();
        $('#logged-in').hide();
    }
}


loginBtn = $('#login-button');

loginBtn.click(function() {
    var client_id = 'c9ce30f810254abfa32846f44b5533cf'; // Your client id
    var redirect_uri = 'http://localhost:8888/'; // Your redirect uri

    var state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope = 'user-read-private user-read-email user-library-read';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
});

function getUserProfile(access_token, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            callback(response);
        }
    });
}

function getUserTracklist(access_token, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks?limit=50',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(tracks) {
            callback(tracks);
        }
    });
}

function getCompiledTemplate(filename, callback) {
    $.get('templates/' + filename + '.handlebars', function(data) {
        callback(Handlebars.compile(data));
    }, 'html');
}

function getPlaylistGenres (tracklist, access_token, callback) {
	album_ids = getAlbumIds(tracklist.items);
	console.log(album_ids);
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
	for(var j = 0; j < Math.floor(tracklist.length/20); j++){
		album_id = "";
		//TODO fix these iterations
		for(var i = j*20; i < (j*20)+20; i++){
			if (i !== (j*20)+19)
				album_id += tracklist[i].track.album.id + ",";
			else
				album_id += tracklist[i].track.album.id;
		}
		album_ids.push(album_id);
	}
	return album_ids;
}

// function getEchonestGenres(spotify_id, callback){
//     $.getJSON('http://developer.echonest.com/api/v4/song/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&track_id=spotify:track:'+spotify_id+'&bucket=song_type&callback=?', function(res) {
//         console.log(res.response.songs[0].song_type);
// 	});
// }