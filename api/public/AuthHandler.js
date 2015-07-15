//auth logic
$('sidebar-container').hide();
var stateKey = 'spotify_auth_state';

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

// var params = getHashParams();
// var access_code = params.code,
//     state = params.state,
//     storedState = localStorage.getItem(stateKey);

loginBtn = $('#login-button');


/**
 * Spotify auth handling
 */
loginBtn.click(function() {
    var client_id = 'c9ce30f810254abfa32846f44b5533cf'; // Your client id
    var redirect_uri = 'http://localhost:3000/'; // Your redirect uri

    var state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope = 'user-read-private user-read-email user-library-read';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
});

if (getParameterByName('code')) {
    loginBtn.hide();
    $('#welcome-header').hide();
    $('sidebar-container').show();
    localStorage.setItem('code', getParameterByName('code'));
    localStorage.setItem('state', getParameterByName('state'));
    //move logic to serverside
    $.ajax({
        type: "POST",
        url: "https://accounts.spotify.com/api/token",
        data: {
            grant_type: "authorization_code",
            code: localStorage.getItem('code'),
            redirect_uri: "http://localhost:3000/",
            client_id: 'c9ce30f810254abfa32846f44b5533cf',
            client_secret: ""
        },
        success: function(info){
        	console.log(info);
        },
        dataType: "json"
    });
}
