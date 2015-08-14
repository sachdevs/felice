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

/**
 * saves user, tracks, and artist data and populates genres
 * @param  {obj} data     response from felice api
 * @return {void}
 */
function saveAllDataToDb(data) {
    saveUser(data);
    getTracks(data.access_token, data.local_token, function(songinfo) {
        // var dateAndIdArr = [];
        // //hash table esque method to check duplicates and create a map of artists that must be called
        // var artistIdUnique = {};
        // for (var i = 0; i < songinfo.length; i++) {
        //     //localstorage date data logic
        //     var dateAndIdObj = {};
        //     dateAndIdObj.date = songinfo[i].added_at;
        //     dateAndIdObj.trackId = songinfo[i].track.id;
        //     dateAndIdArr.push(dateAndIdObj);
        //     (function(i) {
        //         getEchonestGenres(songinfo[i].track.artists[0].id, data.local_token, artistIdUnique, function(genres) {
        //             artistIdUnique[songinfo[i].track.artists[0].id] = genres;
        //             if (i === songinfo.length - 1) {
        //                 saveTracks(artistIdUnique, songinfo, data.local_token);
        //                 saveArtists(Object.keys(artistIdUnique), artistIdUnique, data.access_token, data.local_token);
        //             }
        //         });
        //     })(i);
        // }
        // localStorage.setItem('songData', JSON.stringify(dateAndIdArr));
    });
}

function saveTracks(artistObj, songinfo, local_token) {
    for (var i = 0; i < songinfo.length; i++) {
        //actually saving tracks to db
        var track = new Track();
        //make a list genre list here and put it in artistIdUnique obj
        //modify save artists to use artistIdUnique to get genreList (thereby minimizing api calls to echonest)
        //somehow figure out what to do when more than 120 songs need to be gotten genres for
        //leave when more than 120 songs, check db for the rest
        //put only if doesnt exist is probably the better option
        var trackobj = {
            name: songinfo[i].track.name,
            trackId: songinfo[i].track.id,
            genreList: artistObj[songinfo[i].track.artists[0].id],
            artist: songinfo[i].track.artists[0].name,
            artistId: songinfo[i].track.artists[0].id,
            album: songinfo[i].track.album.name,
            popularity: songinfo[i].track.popularity,
            duration_ms: songinfo[i].track.duration_ms,
            explicit: songinfo[i].track.explicit,
            preview_url: songinfo[i].track.preview_url,
            similar: [],
            token: local_token
        };
        (function() {
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
}

/**
 * Saves artists by a list of id's
 * @param  {Array} artistArr
 * @param  {String} spotify_token
 * @param  {String} local_token   jwt
 * @return {void}
 */
function saveArtists(artistArr, genreObj, spotify_token, local_token) {
    var urlList = createUrlList(artistArr);
    getArtists(urlList, spotify_token, local_token, function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== null) {
                (function() {
                    //actually saving tracks to db
                    var artist = new Artist();
                    var artistobj = {
                        name: safeObjectAccess(data[i], 'name'),
                        artistId: data[i].id,
                        followers: data[i].followers.total,
                        popularity: safeObjectAccess(data[i], 'popularity'),
                        genreList: genreObj[data[i].id],
                        imageUrl: JSON.stringify(safeObjectAccess(data[i], 'images')),
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

/**
 * list of urls for artists so that they can be saved individually
 * @param  {Array} artistArr
 * @return {void}
 */
function createUrlList(artistArr) {
    var urlArr = [];
    var url = 'https://api.spotify.com/v1/artists/?ids=';
    for (var i = 0; i < artistArr.length; i++) {
        if ((i + 1) % 49 === 0) {
            url = url + artistArr[i];
            urlArr.push(url);
            url = 'https://api.spotify.com/v1/artists/?ids=';
        }
        else if (i === artistArr.length - 1)
            url = url + artistArr[i];
        else
            url = url + artistArr[i] + ',';
    }
    urlArr.push(url);
    return urlArr;
}

/**
 * Using list of urls, creates list of artist onjects
 * @param  {Array}   urlList
 * @param  {String}   spotify_token
 * @param  {String}   local_token
 * @param  {Function} callback         List of artists
 * @return {void}
 */
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
        console.log(list.length);
        for (i = 1; i < Math.ceil(t.total / 50); i++) {
            (function(i, list) {
                callSpotify(url + "&offset=" + (50 * i), {}, spotify_token, function(tracks) {
                    list = list.concat(tracks.items);
                    console.log(list.length);
                    if(i === Math.ceil(t.total / 50)-1){
                        console.log(t.total);
                        console.log(list);
                        callback(list);
                    }
                });
            })(i, list);
        }
    });
}

function safeObjectAccess(obj, elementToAccess) {
    try {
        return obj[elementToAccess];
    }
    catch (e) {
        return null;
    }
}

/**
 * Saves user
 * @param  {Object} data      from felice api
 * @return {void}
 */
function saveUser(data) {
    var user = new User();
    var obj = {
        userId: safeObjectAccess(data.body, 'id'),
        name: safeObjectAccess(data.body, 'display_name'),
        email: safeObjectAccess(data.body, 'email'),
        spotifyURI: safeObjectAccess(data.body, 'uri'),
        imageUrl: JSON.stringify(safeObjectAccess(data.body, 'images')),
        country: safeObjectAccess(data.body, 'country'),
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

function getEchonestGenres(spotify_id, local_token, artistObj, callback) {
    //response header with remaining calls: X-Ratelimit-Remaining
    if (artistObj.hasOwnProperty(spotify_id))
        return callback(artistObj.spotify_id);
    else {
        var artist = new Artist({
            artistId: spotify_id,
        });
        artist.fetch({
            headers: {
                "x-access-token": local_token
            },
            success: function(data) {
                return callback(data.genreList);
            },
            error: function() {
                $.getJSON('http://developer.echonest.com/api/v4/artist/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&id=spotify:artist:' + spotify_id + '&bucket=genre&callback=?', function(res) {
                    var arr = res.response.artist.genres;
                    var ret = [];
                    for (var i = 0; i < arr.length; i++)
                        ret.push(arr[i].name);
                    echonestCalled++;
                    callback(ret);
                });

            }
        });
    }
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
