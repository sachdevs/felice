if (access_token && (state == null || state !== storedState)) {
    alert("error");
}
else {
    localStorage.removeItem(stateKey);
    if (access_token) {
        getUserProfile(access_token, function(response) {
            getUserTracklist(access_token, function(tracks) {
                getCompiledTemplate('songlist', function(template) {
                    //$('#logged-in').html(userProfileTemplate(response));
                    //$('#logged-in').html(template(tracks));
                });
                console.log(tracks);
                getPlaylistGenres(tracks, function(genres, artistObj) {
                    // console.log(genres);
                    // console.log(artistObj);
                    data = formatGenres(genres);
                    drawPieGraph(artistObj, data);
                    drawLineGraph();
                    $(window).resize(function() {
                        drawPieGraph(artistObj, data);
                    });
                });
            });
        });
        $('#login').hide();
        $('#logged-in').show();
    }
    else {
        $('#login').show();
        $('#logged-in').hide();
    }
}

function getCompiledTemplate(filename, callback) {
    $.get('templates/' + filename + '.handlebars', function(data) {
        callback(Handlebars.compile(data));
    }, 'html');
}