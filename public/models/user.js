var User = Backbone.Model.extend({
    urlRoot: root + '/api/users',
    idAttribute: 'userId',
    defaults: {
        userId: null,
        name: 'invalid',
        email: 'invalid',
        spotifyURI: 'invalid',
        imageUrl: 'invalid',
        country: 'invalid',
        genreList: [],
        watchingList: []
    }
});

var Users = Backbone.Collection.extend({
    url: '/api/users',
    model: User
});