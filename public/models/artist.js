var Artist = Backbone.Model.extend({
    urlRoot: '/api/artists',
    idAttribute: 'artistId',
    defaults: {
        name: 'invalid',
        artistId: 'invalid',
        followers: 0,
        popularity: 0,
        genreList: [],
        imageUrl: 'invalid'
    }
});
