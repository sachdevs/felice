var AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        "login": "login",
        "profile": "profile",
        "pie": "pie",
        "line": "timegenre",
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
                        saveAllDataToDb(data).done(function() {});
                    },
                    error: function(data) {
                        window.location = root + '/#login';
                    },
                    dataType: "json"
                });
            }
            else {
                if (!window.hasOwnProperty('sidebarView') && window.location.hash !== "#login") {
                    this.sidebarView = new SidebarView();
                }
            }
        });
    },
    home: function() {
        window.songListView = new SongListView();
    },
    profile: function() {
        $('.main-container').html("");
        console.log($('.main-container').html() === "");
        if ($('.main-container').html() === "")
            window.loadingView = new LoadingView();
    },
    pie: function() {
        $('.main-container').html("");
        console.log($('.main-container').html() === "");
        if ($('.main-container').html() === "")
            window.pieView = new PieView();
    },
    timegenre: function(){
        $('.main-container').html("");
        console.log($('.main-container').html() === "");
        if ($('.main-container').html() === "")
            window.lineView = new LineGraph();
    },
    login: function() {
        delete window.sidebarView;
        this.loginView = new LoginView();
    }
});

app = new AppRouter();
Backbone.history.start();
