//auth logic
//wrapped in IIFE because variables not in var.js should not be in global scope
(function() {
    $('sidebar-container').hide();
    var stateKey = 'spotify_auth_state';


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
        $.ajax({
            type: "POST",
            url: root + "/authenticate/",
            data: {
                code: localStorage.getItem('code')
            },
            success: function(info) {
                console.log(info);
            },
            dataType: "json"
        });
    }

})();
