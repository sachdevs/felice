var Track = Backbone.Model.extend({
    urlRoot: '/api/tracks',
    idAttribute: 'trackId',
    defaults: {
        name: 'invalid',
        trackId: 'invalid',
        genreList: [],
        artist: 'invalid',
        artistId: 'invalid',
        album: 'invalid',
        popularity: 'invalid',
        duration_ms: 0,
        explicit: false,
        preview_url: 'invalid',
        similar: []
    }
});

var Tracks = Backbone.Collection.extend({
    model: Track
});
