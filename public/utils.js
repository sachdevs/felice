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
    getTracks(data.access_token, data.local_token, function(songinfo) {
        var dateAndIdArr = [];
        //hash table esque method to check duplicates and create a map of artists that must be called
        var artistIdUnique = {};
        var idToArtist = {};
        for (var i = 0; i < songinfo.length; i++) {
            //localstorage date data logic
            var dateAndIdObj = {};
            dateAndIdObj.date = songinfo[i].added_at;
            dateAndIdObj.trackId = songinfo[i].track.id;
            dateAndIdArr.push(dateAndIdObj);
            if (artistIdUnique.hasOwnProperty(songinfo[i].track.artists[0].id))
                artistIdUnique[songinfo[i].track.artists[0].id]++;
            else
                artistIdUnique[songinfo[i].track.artists[0].id] = 1;
            idToArtist[songinfo[i].track.artists[0].id] = songinfo[i].track.artists[0].name;
        }
        //physically pains me to make two loops but currently cannot see any better way
        var artistArr = Object.keys(artistIdUnique);
        getEchonestGenres(artistArr, data.local_token, artistIdUnique, function(artistGenreMap, genreCount) {
            localStorage.setItem("pieData", JSON.stringify(genreCount));
            var genreArtistMap = createGenreArtistMap(artistGenreMap, idToArtist);
            localStorage.setItem("genreArtistMap", JSON.stringify(genreArtistMap));
            saveTracks(artistGenreMap, songinfo, data.local_token);
            saveArtists(artistArr, artistGenreMap, data.access_token, data.local_token);
            var tempGenreList = [];
            for (var k in genreCount) {
                tempGenreList.push({
                    name: k,
                    count: genreCount[k]
                });
            }
            tempGenreList.sort(compare);
            var genreList = [];
            var val = 10;
            if (tempGenreList.length < 10)
                val = tempGenreList.length;
            for (var i = 0; i < val; i++) {
                genreList.push(tempGenreList[i].name);
            }
            saveUser(data, genreList);
        });
        localStorage.setItem('songData', JSON.stringify(dateAndIdArr));
    });
}

function compare(a, b) {
    if (a.count > b.count)
        return -1;
    if (a.count < b.count)
        return 1;
    return 0;
}

function createGenreArtistMap(obj, idToArtist){
    var ret = {};
    for(var k in obj){
        for(var i = 0; i < obj[k].length; i++){
            if(!ret.hasOwnProperty(obj[k][i]))
                ret[obj[k][i]] = [];
            ret[obj[k][i]].push(idToArtist[k]);
        }
    }
    console.log(ret);
    return ret;
}

/**
 * saves tracks
 * @param  {Object} artistObj   a map of artist id to genre array
 * @param  {Array} songinfo    list of songs from spotify
 * @param  {String} local_token jwt
 * @return {void}
 */
function saveTracks(artistObj, songinfo, local_token) {
    var trackArr = [];
    for (var i = 0; i < songinfo.length; i++) {
        //actually saving tracks to db
        var track = new Track();
        var trackobj = {
            name: songinfo[i].track.name,
            trackId: songinfo[i].track.id,
            genreList: artistObj[songinfo[i].track.artists[0].id] || [],
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
        trackArr.push(trackobj);
        (function(i) {
            track.save(trackobj, {
                success: function(model, response) {
                    console.log('Successfully saved tracks yayyy!');
                },
                error: function(model, error) {
                    console.log(error.responseText);
                }
            });
            if(i === songinfo.length-1){
                localStorage.setItem('trackData', JSON.stringify(trackArr));
                $(window.songListView).trigger('trackData', [trackArr]);
            }
        })(i);
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
                        genreList: genreObj[data[i].id] || [],
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
        (function(i, artistlist) {
            callSpotify(urlList[i], {}, spotify_token, function(items) {
                list = list.concat(items.artists);
                if (i === urlList.length - 1)
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
            (function(i, tracks) {
                callSpotify(url + "&offset=" + (50 * i), {}, spotify_token, function(s) {
                    list = list.concat(s.items);
                    if (list.length === t.total)
                        return callback(list);
                });
            })(i, list);
        }
    });
}

/**
 * auxiliary function to make sure obj exists before trying to access property.
 * @param  {Object} obj
 * @param  {String} elementToAccess
 * @return {Depends} null if DNE
 */
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
function saveUser(data, genreList) {
    var user = new User();
    var obj = {
        userId: safeObjectAccess(data.body, 'id'),
        name: safeObjectAccess(data.body, 'display_name'),
        email: safeObjectAccess(data.body, 'email'),
        spotifyURI: safeObjectAccess(data.body, 'uri'),
        imageUrl: JSON.stringify(safeObjectAccess(data.body, 'images')),
        country: safeObjectAccess(data.body, 'country'),
        genreList: genreList,
        watchingList: [],
        token: data.local_token //auth token
    };
    localStorage.setItem("topTen", JSON.stringify(genreList));
    user.save(obj, {
        success: function(model, response) {
            console.log('Successfully saved yayyy!');
            window.pieView.render();
        },
        error: function(model, error) {
            console.log(error.responseText);
        }
    });
}

/**
 * gets genres using array of artist ids
 * @param  {Array}   artistArr   artist Ids (in this case they are unique)
 * @param  {String}   local_token jwt from felice api
 * @param  {Function} callback
 */
function getEchonestGenres(artistArr, local_token, artistCountMap, callback) {
    //TODO response header with remaining calls: X-Ratelimit-Remaining
    var artistObj = {};
    var genreCount = {};
    for (var i = 0; i < artistArr.length; i++) {
        var artist = new Artist({
            artistId: artistArr[i],
        });
        (function(i, obj, count) {
            artist.fetch({
                headers: {
                    "x-access-token": local_token
                },
                success: function(model, data) {
                    if (data.hasOwnProperty('msg')) {
                        console.log("calling echonest because not in db");
                        $.getJSON('http://developer.echonest.com/api/v4/artist/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&id=spotify:artist:' + artistArr[i] + '&bucket=genre&callback=?', function(res) {
                            var arr = res.response.artist.genres;
                            var ret = [];
                            for (var j = 0; j < arr.length; j++) {
                                ret.push(arr[j].name);
                                if (genreCount.hasOwnProperty(arr[j].name)) {
                                    genreCount[arr[j].name] += artistCountMap[artistArr[i]];
                                }
                                else {
                                    genreCount[arr[j].name] = 1;
                                }
                            }
                            echonestCalled++;
                            artistObj[artistArr[i]] = ret;
                        }).done(function() {
                            if (i === artistArr.length - 1) {
                                return callback(artistObj, genreCount);
                            }
                        });
                    }
                    else {
                        if (data.genreList !== undefined && data.genreList.length !== 0) {
                            console.log("calling db for artist data");
                            var list = data.genreList;
                            artistObj[artistArr[i]] = list;
                            for (var j = 0; j < list.length; j++) {
                                if (genreCount.hasOwnProperty(list[j]))
                                    genreCount[list[j]] += artistCountMap[artistArr[i]];
                                else
                                    genreCount[list[j]] = 1;
                            }
                        }
                        else {
                            console.log("calling echonest in case echonest updated the genres");
                            $.getJSON('http://developer.echonest.com/api/v4/artist/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&id=spotify:artist:' + artistArr[i] + '&bucket=genre&callback=?', function(res) {
                                var arr = res.response.artist.genres;
                                var ret = [];
                                for (var j = 0; j < arr.length; j++) {
                                    ret.push(arr[j].name);
                                    if (genreCount.hasOwnProperty(arr[j].name))
                                        genreCount[arr[j].name] += artistCountMap[artistArr[i]];
                                    else
                                        genreCount[arr[j].name] = 1;
                                }
                                echonestCalled++;
                                artistObj[artistArr[i]] = ret;
                            }).done(function() {
                                if (i === artistArr.length - 1) {
                                    console.log(genreCount);
                                    return callback(artistObj, genreCount);
                                }
                            });
                        }
                    }
                    if (i === artistArr.length - 1) {
                        return callback(artistObj, genreCount);
                    }
                }
            });
        })(i, artistObj, genreCount);
    }
}

function callSpotify(url, data, access_token, callback) {
    spotifyCalled++;
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

/**
 * make sure user still has a valid token
 * @param  {String}   token    spotify token
 * @param  {Function} callback
 */
function checkValidSpotifyToken(token, callback) {
    callSpotify('https://api.spotify.com/v1/me', {}, token, function(data) {
        return callback(data !== null);
    });
}

function unixToISO(d){
    var time = new Date(d);
    return time.toISOString().split("T")[0];
}