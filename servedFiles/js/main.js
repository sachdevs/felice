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
                localStorage.clear(); //REMOVE AFTER
                var table = getDatabase(tracks);
                console.log(table.database);
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

function getDatabase(tracks) {
    var table = new cachedTable("song_data");
    if (table.database) {
        return table;
    }
    table = new cachedTable("song_data", ['name', 'artist', 'artist_id', 'album', 'id', 'genre', 'date', 'href', 'popularity']);
    for (var i = 0; i < tracks.items.length; i++){
        table.addRow([tracks.items[i].track.name, tracks.items[i].track.artists[0].name, tracks.items[i].track.artists[0].id, tracks.items[i].track.album.name, tracks.items[i].track.id, null,
            tracks.items[i].added_at, tracks.items[i].track.href, tracks.items[i].track.popularity]);
    }
    table.updateRows('artist', 'Childish Gambino', 'genre', 'plswork');
    return table;
}
