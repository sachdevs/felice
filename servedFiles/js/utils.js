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

function getPlaylistGenres(tracklist, callback) {
    artistObj = [];
    for (var i = 0; i < tracklist.items.length; i++) {
        (function(i, artistObj) {
            getEchonestGenres(tracklist.items[i].track.artists[0].id, function(genres) {
                obj = {
                    name: tracklist.items[i].track.artists[0].name,
                    id: tracklist.items[i].track.artists[0].id,
                    songs: [],
                    genres: [],
                    count: 1
                };
                var exists = artistExists(artistObj, obj);
                if (exists) {
                    exists.songs.push(tracklist.items[i].track.name);
                    exists.count++;
                }
                else {
                    obj.genres = genres;
                    obj.songs.push(tracklist.items[i].track.name);
                    artistObj.push(obj);
                }
                if (i === tracklist.items.length - 1) {
                    callback(countGenres(artistObj), artistObj);
                }
            });
        })(i, artistObj);
    }
}

function countGenres(artistObj) {
    ret = {};
    totalCount = 0;
    for (var i = 0; i < artistObj.length; i++) {
        multiplier = artistObj[i].count;
        for (var j = 0; j < artistObj[i].genres.length; j++) {
            _name = artistObj[i].genres[j].name;
            if (ret.hasOwnProperty(_name)) {
                ret[_name] += multiplier;

            }
            else ret[_name] = multiplier;
        }
    }
    return ret;
}

function artistExists(artistObj, obj) {
    for (var i = 0; i < artistObj.length; i++) {
        if (artistObj[i].id === obj.id)
            return artistObj[i];
    }
    return undefined;
}

function getEchonestGenres(spotify_id, callback) {
    $.getJSON('http://developer.echonest.com/api/v4/artist/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&id=spotify:artist:' + spotify_id + '&bucket=genre&callback=?', function(res) {
        callback(res.response.artist.genres);
    });
}

function formatGenres(genres) {
    var ret = [];
    for (var i in genres) {
        if (genres.hasOwnProperty(i)) {
            ret.push({
                label: i,
                value: genres[i]
            });
        }
    }
    return ret;
}
