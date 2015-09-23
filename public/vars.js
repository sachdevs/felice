var root = "http://localhost:3000" || "http://feliceapp.herokuapp.com";
var echonestCalled = 0;
var spotifyCalled = 0;
$('#preventAction').hide();

var Loading = {
	load: function(){
		var opts = {
		  lines: 7 // the number of lines to draw
		, length: 0 // the length of each line
		, width: 31 // the line thickness
		, radius: 42 // the radius of the inner circle
		, scale: 1 // scales overall size of the spinner
		, corners: 1 // corner roundness (0..1)
		, color: '#fff' // #rgb or #rrggbb or array of colors
		, opacity: 0.5 // opacity of the lines
		, rotate: 84 // the rotation offset
		, direction: -1 // 1: clockwise, -1: counterclockwise
		, speed: 1 // rounds per second
		, trail: 60 // afterglow percentage
		, fps: 20 // frames per second when using settimeout() as a fallback for css
		, zindex: 2e9 // the z-index (defaults to 2000000000)
		, classname: 'spinner' // the css class to assign to the spinner
		, top: '50%' // top position relative to parent
		, left: '50%' // left position relative to parent
		, shadow: false // whether to render a shadow
		, hwaccel: false // whether to use hardware acceleration
		, position: 'absolute' // element positioning
		}
		this.target = document.getElementsByClassName('main-container')[0];
		this.spinner = new Spinner(opts);
	},
	render: function(){
		var self = this;
		self.spinner.spin(self.target);
		$('#preventAction').show();
	},
	stop: function() {
		this.spinner.stop();
		$('#preventAction').hide();
	}
};
Loading.load();
