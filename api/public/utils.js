/**
 * [DEPR]
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
 * Get query string
 * @param  {name}         The id of the query string searching for
 * @return {results}      Value of key
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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


function saveAllDataToDb(data) {
    saveUser(data);
    getTracks(data.access_token, data.local_token, function(songinfo) {
        var dateAndIdArr = [];
        //hash table esque method to check duplicates and create a map of artists that must be called
        var artistIdUnique = {};
        for (var i = 0; i < songinfo.length; i++) {
            //localstorage date data logic
            var dateAndIdObj = {};
            dateAndIdObj.date = songinfo[i].added_at;
            dateAndIdObj.trackId = songinfo[i].track.id;
            dateAndIdArr.push(dateAndIdObj);
            artistIdUnique[songinfo[i].track.artists[0].id] = true;
            (function() {
                //actually saving tracks to db
                var track = new Track();
                var trackobj = {
                    name: songinfo[i].track.name,
                    trackId: songinfo[i].track.id,
                    genreList: [],
                    artist: songinfo[i].track.artists[0].name,
                    artistId: songinfo[i].track.artists[0].id,
                    album: songinfo[i].track.album.name,
                    popularity: songinfo[i].track.popularity,
                    duration_ms: songinfo[i].track.duration_ms,
                    explicit: songinfo[i].track.explicit,
                    preview_url: songinfo[i].track.preview_url,
                    similar: [],
                    token: data.local_token
                };
                track.save(trackobj, {
                    success: function(model, response) {
                        console.log('Successfully saved tracks yayyy!');
                    },
                    error: function(model, error) {
                        console.log(error.responseText);
                    }
                });
            })();
        }
        saveArtists(Object.keys(artistIdUnique), data.access_token, data.local_token);
        localStorage.setItem('songData', JSON.stringify(dateAndIdArr));
    });
}

function saveArtists(artistArr, spotify_token, local_token) {
    var urlList = createUrlList(artistArr);
    getArtists(urlList, spotify_token, local_token, function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== null) {
                (function() {
                    //actually saving tracks to db
                    var artist = new Artist();
                    var artistobj = {
                        name: data[i].name,
                        artistId: data[i].id,
                        followers: data[i].followers.total,
                        popularity: data[i].popularity,
                        genreList: [],
                        imageUrl: data[i].images[0].url,
                        token: local_token
                    };
                    artist.save(artistobj, {
                        success: function(model, response) {
                            console.log('Successfully saved artists yayyy!');
                        },
                        error: function(model, error) {
                            console.log(error.responseText);
                        }
                    });
                })();
            }
        }
    });
}

function createUrlList(artistArr) {
    var urlArr = [];
    var url = 'https://api.spotify.com/v1/artists/?ids=';
    for (var i = 0; i < artistArr.length; i++) {
        if ((i + 1) % 49 === 0) {
            url = url + artistArr[i];
            urlArr.push(url);
            url = 'https://api.spotify.com/v1/artists/?ids=';
        }
        else if(i === artistArr.length-1)
            url = url + artistArr[i];
        else
            url = url + artistArr[i] + ',';
    }
    urlArr.push(url);
    return urlArr;
}

function getArtists(urlList, spotify_token, local_token, callback) {
    var list = [];
    for (var i = 0; i < urlList.length; i++) {
        (function(i, list) {
            callSpotify(urlList[i], {}, spotify_token, function(items) {
                list = list.concat(items.artists);
                callback(list);
            });
        })(i, list);
    }
}

/**
 * get users tracks
 * @param  {String} spotify_token   spotify auth token
 * @param  {String} local_token     local api auth token
 * @param  {Function} callback
 * @return {void}
 */
function getTracks(spotify_token, local_token, callback) {
    var list = [];
    var url = 'https://api.spotify.com/v1/me/tracks?limit=50';
    callSpotify(url, {}, spotify_token, function(t) {
        list = list.concat(t.items);
        for (i = 1; i < Math.ceil(t.total / 50); i++) {
            (function(i, list) {
                callSpotify(url + "&offset=" + (50 * i), {}, spotify_token, function(tracks) {
                    list = list.concat(tracks.items);
                    callback(list);
                });
            })(i, list);
        }
    });
}

function callSpotify(url, data, access_token, callback) {
    $.ajax(url, {
        dataType: 'json',
        data: data,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(r) {
            callback(r);
        },
        error: function(r) {
            callback(null);
        }
    });
}

function saveUser(data) {
    var user = new User();
    var obj = {
        userId: data.body.id,
        name: data.body.display_name || 'null',
        email: data.body.email || 'null',
        spotifyURI: data.body.uri || 'null',
        imageUrl: data.body.images[0].url || 'null',
        country: data.body.country || 'null',
        genreList: [],
        watchingList: [],
        token: data.local_token //auth token
    };
    user.save(obj, {
        success: function(model, response) {
            console.log('Successfully saved yayyy!');
        },
        error: function(model, error) {
            console.log(error.responseText);
        }
    });
}
