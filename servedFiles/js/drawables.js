function drawPieGraph(obj, data) {
    $("#pie").html("");
    var svg = d3.select("#pie")
        .append("svg")
        .append("g")

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var width = 600,
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

    svg.attr("transform", "translate(" + ((width / 2) + 50) + "," + height / 2 + ")");

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
        var duration = 2500;
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
    // $('.slice').hover(function() {
    //     $('body').hide();
    // }, function(){
    //     $('body').show();
    // });
}

function drawLineGraph() {
    var data = [{
        "sale": "202",
        "year": "2000"
    }, {
        "sale": "215",
        "year": "2002"
    }, {
        "sale": "179",
        "year": "2004"
    }, {
        "sale": "199",
        "year": "2006"
    }, {
        "sale": "134",
        "year": "2008"
    }, {
        "sale": "176",
        "year": "2010"
    }];
    var data2 = [{
        "sale": "152",
        "year": "2000"
    }, {
        "sale": "189",
        "year": "2002"
    }, {
        "sale": "179",
        "year": "2004"
    }, {
        "sale": "199",
        "year": "2006"
    }, {
        "sale": "134",
        "year": "2008"
    }, {
        "sale": "176",
        "year": "2010"
    }];
    var vis = d3.select("#visualisation"),
        WIDTH = 500,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2010]),
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([134, 215]),
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
    vis.append('svg:path')
        .attr('d', lineGen(data))
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    vis.append('svg:path')
        .attr('d', lineGen(data2))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

}
