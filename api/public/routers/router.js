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
                    var temp = new User({
                        userId: data.body.id
                    });
                    var val = temp.fetch({
                        headers: {
                            'x-access-token': data.local_token
                        },
                        success: function(model, res) {
                            saveUser(data, false);
                        },
                        error: function(model, res) {
                            saveUser(data, true);
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
        } else {
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
