var express = require('express');
var app = express();
app.use(express.static(__dirname + '/servedFiles'));
app.listen(8888, function(){
	console.log('listening on 8888');
});