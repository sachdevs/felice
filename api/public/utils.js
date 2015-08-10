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
    var url = 'https://api.spotify.com/v1/me/tracks?limit=50';
    callSpotify(url, {}, spotify_token, function(t){
        list = list.concat(t.items);
        for(i = 1; i < Math.ceil(t.total/50); i++){
            (function(i, list){
                callSpotify(url+"&offset="+(50*i), {}, spotify_token, function(tracks){
                    list = list.concat(tracks.items);
                    console.log(list);
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