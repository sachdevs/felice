var SidebarView = Backbone.View.extend({
    el: $('.sidebar-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var template = Handlebars.templates['sidebar'];
        this.$el.html(template({}));
        $('.bs-sidebar').mouseenter(function() {
            $(this).animate({
                width: '150px'
            }, 150);
        });
        $('.bs-sidebar').mouseleave(function() {
            $(this).animate({
                width: '40px'
            }, 150);
        });
    }
});
