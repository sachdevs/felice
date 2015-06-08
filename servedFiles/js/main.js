var stateKey = 'spotify_auth_state';

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var params = getHashParams();
var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);

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
                    $('#logged-in').html(template(tracks));
                });
                getPlaylistGenres(tracks, function(genres, artistObj) {
                    console.log(genres);
                    console.log(artistObj);
                    data = formatGenres(genres);
                    drawPieGraph(artistObj, data);
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


loginBtn = $('#login-button');

loginBtn.click(function() {
    var client_id = 'c9ce30f810254abfa32846f44b5533cf'; // Your client id
    var redirect_uri = 'http://localhost:8888/'; // Your redirect uri

    var state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope = 'user-read-private user-read-email user-library-read';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
});

function getUserProfile(access_token, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            callback(response);
        }
    });
}

function getUserTracklist(access_token, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks?limit=50',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(tracks) {
            callback(tracks);
        }
    });
}

function getCompiledTemplate(filename, callback) {
    $.get('templates/' + filename + '.handlebars', function(data) {
        callback(Handlebars.compile(data));
    }, 'html');
}

function getPlaylistGenres(tracklist, callback) {
    artistObj = [];
    for (var i = 0; i < tracklist.items.length; i++) {
        (function(i, artistObj) {
            getEchonestGenres(tracklist.items[i].track.artists[0].id, function(genres) {
                obj = {
                    name: tracklist.items[i].track.artists[0].name,
                    id: tracklist.items[i].track.artists[0].id,
                    songs: [],
                    genres: [],
                    count: 1
                };
                var exists = artistExists(artistObj, obj);
                if (exists) {
                    exists.songs.push(tracklist.items[i].track.name);
                    exists.count++;
                }
                else {
                    obj.genres = genres;
                    obj.songs.push(tracklist.items[i].track.name);
                    artistObj.push(obj);
                }
                if (i === tracklist.items.length - 1) {
                    callback(countGenres(artistObj), artistObj);
                }
            });
        })(i, artistObj);
    }
}

function countGenres(artistObj) {
    ret = {};
    totalCount = 0;
    for (var i = 0; i < artistObj.length; i++) {
        multiplier = artistObj[i].count;
        for (var j = 0; j < artistObj[i].genres.length; j++) {
            _name = artistObj[i].genres[j].name;
            if (ret.hasOwnProperty(_name)) {
                ret[_name] += multiplier;

            }
            else ret[_name] = multiplier;
        }
    }
    return ret;
}

function artistExists(artistObj, obj) {
    for (var i = 0; i < artistObj.length; i++) {
        if (artistObj[i].id === obj.id)
            return artistObj[i];
    }
    return undefined;
}

function getEchonestGenres(spotify_id, callback) {
    $.getJSON('http://developer.echonest.com/api/v4/artist/profile?api_key=JWARDUHE5GKDMWFDJ&format=jsonp&id=spotify:artist:' + spotify_id + '&bucket=genre&callback=?', function(res) {
        callback(res.response.artist.genres);
    });
}

function formatGenres(genres) {
    var ret = [];
    for (var i in genres) {
        if (genres.hasOwnProperty(i)) {
            ret.push({
                label: i,
                value: genres[i]
            });
        }
    }
    return ret;
}

function drawPieGraph(obj, data) {
    var svg = d3.select("body")
        .append("svg")
        .append("g")

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var width = 960,
        height = 450,
        radius = Math.min(width, height) / 2;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d) {
        return d.data.label;
    };

    var color = d3.scale.category20()
        .domain(Object.keys(obj));
    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // function randomData() {
    //     var labels = genres;
    //     var values = frequency;
    //     var ret = [];
    //     for(var i = 0; i < labels.length; i++){
    //         ret.push({
    //             label: labels[i],
    //             value
    //         });
    //     }
    //     return ret;

    //     // return labels.map(function(label) {
    //     //     return {
    //     //         label: label,
    //     //         value: Math.random()
    //     //     }
    //     // }).filter(function() {
    //     //     return Math.random() > .5;
    //     // }).sort(function(a, b) {
    //     //     return d3.ascending(a.label, b.label);
    //     // });
    // }

    change(data);

    // d3.select(".randomize")
    //     .on("click", function() {
    //         change(randomData());
    //     });

    function mergeWithFirstEqualZero(first, second) {
        var secondSet = d3.set();
        second.forEach(function(d) {
            secondSet.add(d.label);
        });

        var onlyFirst = first
            .filter(function(d) {
                return !secondSet.has(d.label)
            })
            .map(function(d) {
                return {
                    label: d.label,
                    value: 0
                };
            });
        return d3.merge([second, onlyFirst])
            .sort(function(a, b) {
                return d3.ascending(a.label, b.label);
            });
    }

    function change(data) {
        var duration = +document.getElementById("duration").value;
        var data0 = svg.select(".slices").selectAll("path.slice")
            .data().map(function(d) {
                return d.data
            });
        if (data0.length == 0) data0 = data;
        var was = mergeWithFirstEqualZero(data, data0);
        var is = mergeWithFirstEqualZero(data0, data);

        /* ------- SLICE ARCS -------*/

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(was), key);

        slice.enter()
            .insert("path")
            .attr("class", "slice")
            .style("fill", function(d) {
                return color(d.data.label);
            })
            .each(function(d) {
                this._current = d;
            });

        slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(is), key);

        slice
            .transition().duration(duration)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc(_this._current);
                };
            });

        slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice
            .exit().transition().delay(duration).duration(0)
            .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
            .data(pie(was), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .style("opacity", 0)
            .text(function(d) {
                return d.data.label;
            })
            .each(function(d) {
                this._current = d;
            });

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        text = svg.select(".labels").selectAll("text")
            .data(pie(is), key);

        text.transition().duration(duration)
            .style("opacity", function(d) {
                return d.data.value == 0 ? 0 : 1;
            })
            .attrTween("transform", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")";
                };
            })
            .styleTween("text-anchor", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start" : "end";
                };
            });

        text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        text
            .exit().transition().delay(duration)
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(was), key);

        polyline.enter()
            .append("polyline")
            .style("opacity", 0)
            .each(function(d) {
                this._current = d;
            });

        polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(is), key);

        polyline.transition().duration(duration)
            .style("opacity", function(d) {
                return d.data.value == 0 ? 0 : .5;
            })
            .attrTween("points", function(d) {
                this._current = this._current;
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline
            .exit().transition().delay(duration)
            .remove();
    };
    $('.slice').hover(function() {
        $('body').hide();
    }, function(){
        $('body').show();
    });
}
