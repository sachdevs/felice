var User = Backbone.Model.extend({
    urlRoot: '/api/users',
    idAttribute: 'userId',
    defaults: {
        userId: 'invalid',
        name: 'invalid',
        email: 'invalid',
        spotifyURI: 'invalid',
        imageUrl: 'invalid',
        country: 'invalid',
        genreList: [],
        watchingList: []
    }
});
