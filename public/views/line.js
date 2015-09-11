var LineGraph = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var allTracks = JSON.parse(localStorage.getItem("trackData"));
        var dateTrackArr = JSON.parse(localStorage.getItem("songData"));
        var genreList = Object.keys(JSON.parse(localStorage.getItem("genreArtistMap")));
        var trackIdDateMap = {};

        for(var i = 0; i < dateTrackArr.length; i++)
            trackIdDateMap[dateTrackArr[i].trackId] = dateTrackArr[i].date;

        var unformattedDataObj = {};
        for(var i = 0; i < genreList.length; i++){
            unformattedDataObj[genreList[i]] = {};
            for(var j = 0; j < allTracks.length; j++){
                var date = trackIdDateMap[allTracks[j].trackId].split('T')[0];
                if(!unformattedDataObj[genreList[i]].hasOwnProperty(date))
                    unformattedDataObj[genreList[i]][date] = 0;
                for(var k = 0; k < allTracks[j].genreList.length; k++){
                    if(allTracks[j].genreList[k] === genreList[i])
                        unformattedDataObj[genreList[i]][date]++;
                }
            }
        }
        var formattedDataObj = [];
        var data = [];

        for(var name in unformattedDataObj){
            var temp = {};
            temp.key = name;
            temp.values = [];
            var datea = 2001;
            var tempDataObj = {};
            for(var date in unformattedDataObj[name]){
                var tempDateObj = {};
                tempDateObj.Genre = name;
                tempDateObj.Date = datea;
                tempDateObj.Number = unformattedDataObj[name][date];
                temp.values.push(tempDateObj);

                tempDataObj.Genre = name;
                tempDataObj.Date = datea;
                tempDataObj.Number = unformattedDataObj[name][date];

                data.push(tempDataObj);
                datea++;
            }
            formattedDataObj.push(temp);
        }
        console.log(data.slice(0,2));
        console.log(formattedDataObj.slice(0,2));

        this.draw(data.slice(0,6));
    },
    /**
     * data in the format:
     * Genre: "name",
     * Date: Int in unix time
     * Number: # of tracks added at that day
     */
    draw: function(data) {
        var datall = [{
            "Genre": "ABC",
            "Number": "202",
            "Date": "2000"
        }, {
            "Genre": "ABC",
            "Number": "215",
            "Date": "2002"
        }, {
            "Genre": "ABC",
            "Number": "179",
            "Date": "2004"
        }, {
            "Genre": "ABC",
            "Number": "199",
            "Date": "2006"
        }, {
            "Genre": "ABC",
            "Number": "134",
            "Date": "2008"
        }, {
            "Genre": "ABC",
            "Number": "176",
            "Date": "2010"
        }, {
            "Genre": "XYZ",
            "Number": "100",
            "Date": "2000"
        }, {
            "Genre": "XYZ",
            "Number": "215",
            "Date": "2002"
        }, {
            "Genre": "XYZ",
            "Number": "179",
            "Date": "2004"
        }, {
            "Genre": "XYZ",
            "Number": "199",
            "Date": "2006"
        }, {
            "Genre": "XYZ",
            "Number": "134",
            "Date": "2008"
        }, {
            "Genre": "XYZ",
            "Number": "176",
            "Date": "2013"
        }];
        var dataGroup = d3.nest()
            .key(function(d) {
                return d.Genre;
            })
            .entries(data);
        console.log(JSON.stringify(dataGroup));
        var color = d3.scale.category10();
        this.$el.append('<svg id="visualisation" width="1000" height="500"></svg>');
        var vis = d3.select("#visualisation"),
            WIDTH = 1000,
            HEIGHT = 500,
            MARGINS = {
                top: 50,
                right: 20,
                bottom: 50,
                left: 50
            },
            lSpace = WIDTH / dataGroup.length;
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function(d) {
                return d.Date;
            }), d3.max(data, function(d) {
                return d.Date;
            })]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function(d) {
                return d.Number;
            }), d3.max(data, function(d) {
                return d.Number;
            })]),
            xAxis = d3.svg.axis()
            .scale(xScale),
            yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        vis.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
        vis.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        var lineGen = d3.svg.line()
            .x(function(d) {
                return xScale(d.Date);
            })
            .y(function(d) {
                return yScale(d.Number);
            })
            .interpolate("basis");
        dataGroup.forEach(function(d, i) {
            vis.append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function(d, j) {
                    return "hsl(" + Math.random() * 360 + ",100%,50%)";
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key)
                .attr('fill', 'none');
            vis.append("text")
                .attr("x", (lSpace / 2) + i * lSpace)
                .attr("y", HEIGHT)
                .attr("class", "legend")
                .on('click', function() {
                    var active = d.active ? false : true;
                    var opacity = active ? 0 : 1;
                    d3.select("#line_" + d.key).style("opacity", opacity);
                    d.active = active;
                })
                .text(d.key);
        });
    }
});