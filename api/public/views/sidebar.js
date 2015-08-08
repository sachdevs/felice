var SidebarView = Backbone.View.extend({
    el: $('.sidebar-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var template = Handlebars.templates['sidebar'];
        this.$el.html(template({}));
        //all the cool animations
        $('#mainlogo').hide();
        $('.sidebar-labels').hide();
        $('.bs-sidebar').mouseenter(function() {
            $(this).animate({
                width: '170px'
            }, 150);
            $('.svg-icon').not($('#mainlogo')).animate({
                'margin': '0px',
                'margin-left': '10px',
                'margin-top': '35px',
                'height': '20px',
                'width': '20px'
            }, 150);
            $('.sidebar-labels').show();
            $('#home').hide();
            $('#mainlogo').show();
        });

        $('.bs-sidebar').mouseleave(function() {
            $(this).animate({
                width: '70px'
            }, 150);
            $('.svg-icon').not($('#mainlogo')).animate({
                'margin': '25px',
                'margin-left': '10px',
                'width': '40px',
                'height': '40px'
            }, 150);
            $('.sidebar-labels').hide();
            $('#home').show();
            $('#mainlogo').hide();
        });
    }
});
