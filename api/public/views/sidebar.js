var SidebarView = Backbone.View.extend({
	el: $('.sidebar-container'),
	initialize: function(){
		alert("hi");
		this.render();
	},
	render: function(){
		var template = _.template( $("#sidebar-template").html(), {} );
		this.$el.html(template);
	}
});

var sidebar = new SidebarView();