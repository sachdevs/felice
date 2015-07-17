(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"container\">\r\n    <h1 id=\"welcome-header\">Welcome to felice</h1>\r\n    <button id=\"login-button\" class=\"btn btn-primary\">Login with Spotify</button>\r\n</div>";
},"useData":true});
templates['sidebar'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"bs-sidebar affix\">\r\n    <ul class=\"nav bs-sidenav\">\r\n        <li class=\"active\">\r\n            <ul class=\"nav\">\r\n                <li><a href=\"#\">1</a></li>\r\n                <li><a href=\"#\">2</a></li>\r\n            </ul>\r\n        </li>\r\n    </ul>\r\n</div>";
},"useData":true});
})();
