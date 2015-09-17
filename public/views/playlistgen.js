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
                self.getUser(query);
            }
            else if(code === 13){
                $(".playlist-gen").html('<h3 id="err"> Your Spotify URI is invalid! </h3>')
                $("#err").hide();
                $("#err").show(500);
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
                self.render(JSON.parse(localStorage.getItem("topTen")), r.genreList);
            },
            error: function(r) {
                $(".playlist-gen").html('<h3 id="err"> User not found, introduce them to felice!</h3>')
                $("#err").hide();
                $("#err").show(500);
            }
        });
    },
    render: function(topTenA, topTenB) {
        var uniqueA = {};
        //compute intersection
        var intersection = [];
        for (var i = 0; i < topTenA.length; i++)
            uniqueA[topTenA[i]] = true;
        for (var i = 0; i < topTenB.length; i++) {
            if (uniqueA.hasOwnProperty(topTenB[i]))
                intersection.push(topTenB[i]);
        }
        console.log(intersection);
    }
});