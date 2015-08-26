var SongListView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        $(this).on('trackData', this.render);
        if(localStorage.getItem('trackData'))
            this.render(null, JSON.parse(localStorage.getItem('trackData')));
    },
    render: function(e, trackData) {
        console.log(trackData);
        var template = Handlebars.templates['songlist'];
        this.$el.html(template({
            songList: trackData
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