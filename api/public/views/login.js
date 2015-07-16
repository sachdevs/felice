var LoginView = Backbone.View.extend({
	el: $('.login-container'),
	initialize: function(){
		this.render();
	},
	render: function(){
		var template = Handlebars.templates['login'];
		this.$el.html(template({}));
	}
});

var login = new LoginView();