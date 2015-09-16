var LineGraph = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var allTracks = JSON.parse(localStorage.getItem("trackData"));
        var dateTrackArr = JSON.parse(localStorage.getItem("songData"));
        var pieData = JSON.parse(localStorage.getItem("pieData"));
        var genreList = Object.keys(JSON.parse(localStorage.getItem("genreArtistMap")));
        var trackIdDateMap = {};

        for (var i = 0; i < dateTrackArr.length; i++)
            trackIdDateMap[dateTrackArr[i].trackId] = dateTrackArr[i].date;

        var unformattedDataObj = {};
        for (var i = 0; i < genreList.length; i++) {
            unformattedDataObj[genreList[i]] = {};
            for (var j = 0; j < allTracks.length; j++) {
                var date = Date.parse(trackIdDateMap[allTracks[j].trackId].split('T')[0] + " 00:00:00");
                if (!unformattedDataObj[genreList[i]].hasOwnProperty(date))
                    unformattedDataObj[genreList[i]][date] = 0;
                for (var k = 0; k < allTracks[j].genreList.length; k++) {
                    if (allTracks[j].genreList[k] === genreList[i])
                        unformattedDataObj[genreList[i]][date]++;
                }
            }
        }
        console.log(unformattedDataObj);
        var data = [];

        for (var name in unformattedDataObj) {
            for (var date in unformattedDataObj[name]) {
                var temp = {};
                if (pieData[name] > 1) {
                    temp.Genre = name;
                    temp.Number = unformattedDataObj[name][date];
                    temp.Date = date;
                    data.push(temp);
                }
            }
        }
        console.log(data);

        function compare(a, b) {
            if (a.Date > b.Date)
                return -1;
            if (a.Date < b.Date)
                return 1;
            if (a.Date === b.Date)
                return 0;
        }

        this.draw(data.sort(compare));
    },
    /**
     * data in the format:
     * Genre: "name",
     * Date: Int in unix time
     * Number: # of tracks added at that day
     */
    draw: function(data) {
        var self = this;
        var dataGroup = d3.nest()
            .key(function(d) {
                return d.Genre;
            })
            .entries(data);
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, -100])
            .html(function(d) {
                return d.Genre;
            });
        var color = d3.scale.category10();
        var WIDTH = window.innerWidth;
        this.$el.append('<svg id="visualisation" width="1000" height="'+WIDTH+'"></svg>');
        var vis = d3.select("#visualisation"),
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
            .scale(xScale)
            .tickFormat(unixToISO),
            yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        vis.call(tip);

        vis.append("svg:g")
            .attr("class", "axis xaxis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(90)");
        vis.append("svg:g")
            .attr("class", "axis yaxis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        vis.selectAll(".xaxis text") // select all the text elements for the xaxis
            .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
            });

        var lineGen = d3.svg.line()
            .x(function(d) {
                return xScale(d.Date);
            })
            .y(function(d) {
                return yScale(d.Number);
            })
            .interpolate("basis");
        dataGroup.forEach(function(d, i) {
            vis.selectAll('#visualization.path')
                .data(d.values)
                .enter()
                .append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function(d, j) {
                    return "hsl(" + Math.random() * 360 + ",100%,50%)";
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key.replace(/\s|&/g, ''))
                .attr('fill', 'none')
                .attr('class', 'line-paths')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

        });
        vis.style('float', 'left');

    }
});