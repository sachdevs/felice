var LoadingView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.html('<img class="loader" src="icons/721.GIF" dynsrc="icons/721.GIF" loop=infinite alt="Astronauts on the moon">');
        window.onresize = function(){
            var properties = $('.main-container').css(["height", "width"]);
            // console.log(properties);
        };
    }
});