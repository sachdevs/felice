var AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        "login": "login",
        "profile": "profile",
        "pie": "pie",
        "timegenre": "timegenre",
        "searchuser/:query": "search"
    },
    initialize: function() {
        //TEMP TODO should actually check for tokens not auth codes
        checkValidSpotifyToken(localStorage.getItem('spotify_token'), function(isValid) {
            if (!isValid) {
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
                        localStorage.setItem('spotify_token', data.access_token);
                        this.sidebarView = new SidebarView();
                        console.log(data);
                        saveAllDataToDb(data);
                    },
                    error: function(data) {
                        window.location = root + '/#login';
                    },
                    dataType: "json"
                });
            }
            else {
                if (!window.hasOwnProperty('sidebarView')) {
                    this.sidebarView = new SidebarView();
                }
            }
        });
    },
    home: function() {},
    profile: function() {
        alert("hi");
    },
    login: function() {
        this.loginView = new LoginView();
    }
});

app = new AppRouter();
Backbone.history.start();
