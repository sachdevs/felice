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
                getPlaylistGenres(tracks, function(genres, artistObj){
                	console.log(genres);
                    console.log(artistObj);
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

function getPlaylistGenres(tracklist, callback) {
    artistObj = [];
    for(var i = 0; i < tracklist.items.length; i++){
        (function(i, artistObj){
            getEchonestGenres(tracklist.items[i].track.artists[0].id, function(genres){
                obj = {
                    name: tracklist.items[i].track.artists[0].name,
                    id: tracklist.items[i].track.artists[0].id,
                    songs: [],
                    genres: [],
                    count: 1
                };
                var exists = artistExists(artistObj, obj);
                if(exists){
                    exists.songs.push(tracklist.items[i].track.name);
                    exists.count++;
                }
                else{
                    obj.genres = genres;
                    obj.songs.push(tracklist.items[i].track.name);
                    artistObj.push(obj);
                }
                if(i === tracklist.items.length-1){
                    callback(countGenres(artistObj), artistObj);
                }
            });
        })(i, artistObj);
    }
}

function countGenres(artistObj){
    ret = {};
    for(var i = 0; i < artistObj.length; i++){
        multiplier = artistObj[i].count;
        for(var j = 0; j < artistObj[i].genres.length; j++){
            _name = artistObj[i].genres[j].name;
            if(ret.hasOwnProperty(_name))
                ret[_name] += multiplier;
            else
                ret[_name] = multiplier;
        }
    }
    return ret;
}

function artistExists(artistObj, obj){
    for(var i = 0; i < artistObj.length; i++){
        if(artistObj[i].id === obj.id)
            return artistObj[i];
    }
    return undefined;
}

function getEchonestGenres(spotify_id, callback){
    $.getJSON('http://developer.echonest.com/api/v4/artist/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&id=spotify:artist:'+spotify_id+'&bucket=genre&callback=?', function(res) {
        callback(res.response.artist.genres);
    });
}