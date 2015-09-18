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
        context.intersection = intersection;
        if(userData.name !== null)
            context.name = userData.name;
        else
            context.name = userData.userId;
        var template = Handlebars.templates['generator'];
        $(".playlist-gen").html(template({context}));
        $(".playlist-gen").hide();
        $(".playlist-gen").show(500);
        console.log(intersection);
    },
    showErr: function(str) {
        $(".playlist-gen").html('<h3 id="err">' + str + '</h3>');
        $("#err").hide();
        $("#err").show(500);
    }
});