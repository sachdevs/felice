var SidebarView = Backbone.View.extend({
    el: $('.sidebar-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var template = Handlebars.templates['sidebar'];
        this.$el.html(template({}));
        $('#song-list').click(function() {
            window.location = root + '/#';
        });
        $('#pie').click(function() {
            window.location = root + '/#pie';
        });
        $('#line').click(function() {
            window.location = root + '/#line';
        });
        $('#add-friend').click(function() {
            window.location = root + '/#add-friend';
        });
        $('#profile').click(function() {
            window.location = root + '/#profile';
        });
        $('.sidebar-containers').mouseover(function() {
            $(this).css("background-color", "#cccccc");
            $(this).css('cursor', 'pointer');
        });
        $('.sidebar-containers').mouseleave(function() {
            $(this).css("background-color", "black");
            $(this).css('cursor', 'default');
        });
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
