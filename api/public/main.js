//main logic goes here
$('.bs-sidebar').mouseenter(function(){
	$(this).animate({width: '100px'}, 200);
});
$('.bs-sidebar').mouseleave(function(){
	$(this).animate({width: '40px'}, 200);
});
