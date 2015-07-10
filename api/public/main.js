//main logic goes here
//REMEMBER TO MOVE THIS TO VIEW LOGIC
$('.bs-sidebar').mouseenter(function(){
	$(this).animate({width: '150px'}, 200);
});
$('.bs-sidebar').mouseleave(function(){
	$(this).animate({width: '40px'}, 200);
});