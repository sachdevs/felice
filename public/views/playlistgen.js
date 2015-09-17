var PlaylistGenView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        alert('1');
        $.ajax(root+'/api/users/'+'12136820598', {
            dataType: 'json',
            headers: {
                'x-access-token': localStorage.getItem('local_token')
            },
            success: function(r) {
                console.log(r);
            },
            error: function(r) {
                console.log(r);
            }
        });
        this.render();
    },
    render: function() {}
});