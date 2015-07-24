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
 * save user's saved tracks to db
 * @param  {String} spotify_token   spotify auth token
 * @param  {String} local_token     local api auth token
 * @param  {Function} callback
 * @return {void}
 */
function saveTracks(spotify_token, local_token, callback) {
    var list = [];
    fetchSavedTracks(function(data) {
        list.push(data.tracks);
        console.log(list);
        while (data.tracks.next) {
            (function(list){
                callSpotify(data.tracks.next, {}, function(tracks) {
                    list.push(tracks);
                    console.log(list);
                });
            })(list);
        }
    }, spotify_token);
}

function fetchSavedTracks(callback, access_token) {
    var url = 'https://api.spotify.com/v1/me/tracks';
    callSpotify(url, {}, access_token, callback);
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
