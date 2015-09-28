var LoginView = Backbone.View.extend({
    el: $('.login-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        if(!window.hasOwnProperty('chrome'))
            alert("Optimized for Chrome, not tested on other browsers yet! Use with caution");
        var self = this;
        this.$el.show();
    	//covering edge case where user forcefully concatenates /#login to a random url
    	$('.bs-sidebar').hide();

        var template = Handlebars.templates['login'];
        this.$el.html(template({}));

        var stateKey = 'spotify_auth_state';
        loginBtn = $('#login-button');

        /**
         * Spotify auth handling
         */
        loginBtn.click(function() {
            var client_id = 'b5ad9becd0a54c3bb45f0aed733dab1f';
            var redirect_uri = root+'/';

            var state = generateRandomString(16);

            localStorage.setItem(stateKey, state);
            var scope = 'user-read-private user-read-email user-library-read playlist-modify-public';

            var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=code';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);
            url += '&show_dialog=' + encodeURIComponent('true');

            spotifyCalled++;
            self.$el.hide();

            window.location = url;
        });
    }
});