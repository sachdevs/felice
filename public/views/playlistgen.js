var PlaylistGenView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.renderSearchBar();
    },
    renderSearchBar: function() {
        var template = Handlebars.templates['search'];
        var self = this;
        this.$el.html(template({}));
        $("#search-bar").keyup(function(e) {
            var code = e.which;
            var query = $(this).val();
            if (code === 13 && query !== '' && query.indexOf(':') !== -1) {
                query = query.split(':')[2];
                if (query !== localStorage.getItem("userId"))
                    self.getUser(query);
                else {
                    self.showErr("That's your own URI :)");
                }
            } else if (code === 13) {
                self.showErr('Your Spotify URI is invalid!');
            }
        });
    },
    getUser: function(userId) {
        var self = this;
        $.ajax(root + '/api/users/' + userId, {
            dataType: 'json',
            headers: {
                'x-access-token': localStorage.getItem('local_token')
            },
            success: function(r) {
                self.render(JSON.parse(localStorage.getItem("topTen")), r.genreList, r);
            },
            error: function(r) {
                self.showErr('User not found, introduce them to felice!');
            }
        });
    },
    render: function(topTenA, topTenB, userData) {
        var uniqueA = {};
        //compute intersection
        var intersection = [];
        for (var i = 0; i < topTenA.length; i++)
            uniqueA[topTenA[i]] = true;
        for (var i = 0; i < topTenB.length; i++) {
            if (uniqueA.hasOwnProperty(topTenB[i]))
                intersection.push(topTenB[i]);
        }
        var context = {};
        context.intersection = intersection.join(', ');
        if(intersection.length === 0)
            context.intersection = "Your tastes are too different! Playlist genreation for special cases such as yours is in development! Thanks for your patience"
        Loading.render();
        getSongsByGenre(intersection, function(trackList) {
            Loading.stop();
            if (userData.name !== null)
                context.name = userData.name;
            else
                context.name = userData.userId;
            context.recommendedSongList = trackList;
            var template = Handlebars.templates['generator'];
            $(".playlist-gen").html(template({
                context
            }));

            $(".playlist-gen").hide();
            $(".playlist-gen").show(500);
            var trackData = JSON.parse(localStorage.getItem('trackData'));
            var stopPropHandler = function(event) {
                event.stopPropagation();
            };
            var inItemClick = function() {
                $(this).css("background-color", "#404040");
                $(this).removeClass("initem");
                $(this).addClass("recitem").click(recItemClick);
                var minus = $(this).html().replace('<div class="icon-plus"><p class="song-name">-</p></div>', '<div class="icon-plus"><p class="song-name">+</p></div>');
                $(this).html(minus);
                $(this).prependTo('.rec-songlist');
            };
            var recItemClick = function() {
                $(this).css("background-color", "#404040");
                $(this).removeClass("recitem");
                $(this).addClass("initem").click(inItemClick);
                var minus = $(this).html().replace('<div class="icon-plus"><p class="song-name">+</p></div>', '<div class="icon-plus"><p class="song-name">-</p></div>');
                $(this).html(minus);
                $(this).prependTo('.in-songlist');
            };
            console.log(intersection);
            $('.initem').click(inItemClick);
            $('.recitem').click(recItemClick);
            $('.track').mouseover(function() {
                $(this).css("background-color", "#2D2D2D");
            });
            $('.track').mouseleave(function() {
                $(this).css("background-color", "#404040");
            });
            $(".play-button").click(stopPropHandler);
            var playlistName = "You and " + context.name + " by felice";
            $('.save-songs').click(function() {
                Loading.render();
                var h = $('.in-songlist .initem').find('.uridata');
                var uris = [];
                for (var i = 0; i < h.length; i++) {
                    uris.push($(h[i]).text());
                }
                if(uris.length === 0){
                    Loading.stop();
                    return;
                }
                var token = localStorage.getItem("spotify_token");
                callSpotifyPost('https://api.spotify.com/v1/users/'+ localStorage.getItem("userId") +'/playlists', {
                    name: playlistName
                }, token, function(data) {
                    var playlistId = data.id;
                    callSpotifyPost('https://api.spotify.com/v1/users/'+ localStorage.getItem("userId") +'/playlists/'+ playlistId +'/tracks', {
                        uris: uris
                    }, token, function(data){
                        Loading.stop();
                    });
                });
            });
        });
    },
    showErr: function(str) {
        $(".playlist-gen").html('<h3 id="err">' + str + '</h3>');
        $("#err").hide();
        $("#err").show(500);
    }
});