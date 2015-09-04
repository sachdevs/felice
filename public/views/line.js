var LineGraph = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var data = [{
            "Client": "ABC",
            "sale": "202",
            "year": "2000"
        }, {
            "Client": "ABC",
            "sale": "215",
            "year": "2002"
        }, {
            "Client": "ABC",
            "sale": "179",
            "year": "2004"
        }, {
            "Client": "ABC",
            "sale": "199",
            "year": "2006"
        }, {
            "Client": "ABC",
            "sale": "134",
            "year": "2008"
        }, {
            "Client": "ABC",
            "sale": "176",
            "year": "2010"
        }, {
            "Client": "XYZ",
            "sale": "100",
            "year": "2000"
        }, {
            "Client": "XYZ",
            "sale": "215",
            "year": "2002"
        }, {
            "Client": "XYZ",
            "sale": "179",
            "year": "2004"
        }, {
            "Client": "XYZ",
            "sale": "199",
            "year": "2006"
        }, {
            "Client": "XYZ",
            "sale": "134",
            "year": "2008"
        }, {
            "Client": "XYZ",
            "sale": "176",
            "year": "2013"
        }];
        var dataGroup = d3.nest()
            .key(function(d) {
                return d.Client;
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
                return d.year;
            }), d3.max(data, function(d) {
                return d.year;
            })]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function(d) {
                return d.sale;
            }), d3.max(data, function(d) {
                return d.sale;
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
                return xScale(d.year);
            })
            .y(function(d) {
                return yScale(d.sale);
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