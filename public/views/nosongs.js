var NoSongsView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.append("<h1> You have no songs in your Spotify library! </h1>");
    }
});