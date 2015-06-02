$.get('templates/mainData.handlebars', function(data) {
	var mainTemplate = Handlebars.compile(data);
	var context = {
		title: "My New Post",
		body: "This is my first post!"
	};
	$('#logged-in').html(mainTemplate(context));
}, 'html');
