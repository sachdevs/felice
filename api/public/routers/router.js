var AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        "login": "login",
        "pie": "pie",
        "timegenre": "timegenre",
        "searchuser/:query": "search"
    },
    initialize: function() {
        //TEMP TODO should actually check for tokens not auth codes
        if (localStorage.getItem('code') || getParameterByName('code')) {
            if (getParameterByName('code')) {
                localStorage.setItem('code', getParameterByName('code'));
                localStorage.setItem('state', getParameterByName('state'));
            }
            $.ajax({
                type: "POST",
                url: root + "/authenticate/",
                data: {
                    code: localStorage.getItem('code')
                },
                success: function(data) {
                    console.log(data);
                    saveTracks(data.access_token, data.local_token, function(data) {
                        alert(data);
                    });
                    var type = 'post';
                    var user = new User({
                        userId: '123123',
                        token: data.local_token
                    });
                    if (user.fetch())
                        type = 'put';
                    //data.body.id
                    console.log(type);

                    user.save({
                        userId: data.body.id || 'null',
                        name: data.body.display_name || 'null',
                        email: data.body.email || 'null',
                        spotifyURI: data.body.uri || 'null',
                        imageUrl: data.body.images[0].url || 'null',
                        country: data.body.country || 'null',
                        genreList: [],
                        watchingList: [],
                        token: data.local_token //auth token
                    }, {
                        success: function(model, response) {
                            console.log('Successfully saved yayyy!');
                        },
                        error: function(model, error) {
                            console.log(model.toJSON());
                            console.log('error.responseText');
                        }
                    });
                },
                error: function(data) {
                    window.location = root + '/#login';
                },
                dataType: "json"
            }).done(function() {
                this.sidebarView = new SidebarView();
            });
        }
        else {
            window.location = root + '/#login';
        }
    },
    home: function() {},
    login: function() {
        this.loginView = new LoginView();
    }
});

app = new AppRouter();
Backbone.history.start();
