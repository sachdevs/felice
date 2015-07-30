var User = Backbone.Model.extend({
    url: function(){
        return '/api/users'
    },
    defaults: {
        userId: 'invalid',
        name: 'invalid',
        email: 'invalid',
        spotifyURI: 'invalid',
        imageUrl: 'invalid',
        country: 'invalid',
        genreList: [],
        watchingList: [],
        id: null
    }
});
