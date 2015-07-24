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
function saveTracks(spotify_token, local_token, callback){
    getTrackList(spotify_token, function(){
        callback("done");
    });
}

function getTrackList(spotify_token, callback){
    var songList = [];
    var nextUrl = ['https://api.spotify.com/v1/me/tracks?limit=50'];
    for(i = 0; i < 2; i++){
        (function(songList, nextUrl, i){
            console.log(nextUrl[i]);
            $.ajax({
                url: nextUrl[i] || 'https://api.spotify.com/v1/me/tracks?limit=50',
                headers: {
                    'Authorization': 'Bearer ' + spotify_token
                },
                success: function(tracks) {
                    songList.push(tracks);
                    nextUrl.push(tracks.next);
                    if(!nextUrl[i+1]){
                        callback(songList);
                        console.log(songList);
                    }
                }
            });
        })(songList, nextUrl, i);
    }
}