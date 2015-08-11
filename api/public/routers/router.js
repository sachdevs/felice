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
                    saveAllDataToDb(data);
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
