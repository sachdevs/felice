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
                var date = Date.parse(trackIdDateMap[allTracks[j].trackId].split('T')[0] + " 00:00:00");
                if(!unformattedDataObj[genreList[i]].hasOwnProperty(date))
                    unformattedDataObj[genreList[i]][date] = 0;
                for(var k = 0; k < allTracks[j].genreList.length; k++){
                    if(allTracks[j].genreList[k] === genreList[i])
                        unformattedDataObj[genreList[i]][date]++;
                }
            }
        }
        console.log(unformattedDataObj);
        var data = [];

        for(var name in unformattedDataObj){
            for(var date in unformattedDataObj[name]){
                var temp = {};
                temp.Genre = name;
                temp.Number = unformattedDataObj[name][date];
                temp.Date = date;
                data.push(temp);
            }
        }
        console.log(data);

        function compare(a, b){
            if(a.Date > b.Date)
                return -1;
            if(a.Date < b.Date)
                return 1;
            if(a.Date === b.Date)
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
        var dataGroup = d3.nest()
            .key(function(d) {
                return d.Genre;
            })
            .entries(data);
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