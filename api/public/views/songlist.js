var SongListView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        $(this).on('trackData', this.render);
    },
    render: function(e, trackData) {
        console.log(trackData);
        trackCollection = [{
            id: 0
        }, {
            id: 1
        }, {
            id: 2
        }, {
            id: 3
        }, {
            id: 4
        }];
        var template = Handlebars.templates['songlist'];
        this.$el.html(template({
            songList: trackCollection
        }));
    },
    destroyView: function() {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();
        this.$el.removeData().unbind();

        // Remove view from DOM
        this.remove();
        Backbone.View.prototype.remove.call(this);
    }
});
