var PieView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
        this.render();
    },
    render: function() {
        var data = JSON.parse(localStorage.getItem("pieData"));
        var topTen = JSON.parse(localStorage.getItem("topTen"));
        var obj = {};
        for(var i = 0; i < topTen.length; i++){
            topTen[i] = topTen[i].replace(/\s|&/g, '');
            obj[topTen[i]] = true;
        }
        console.log(topTen);
        this.draw(data, obj);
    },
    draw: function(dataObj, topTen) {
        var svg = d3.select(".main-container")
            .append("svg")
            .attr("class", "pie-chart")
            .append("g")

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        var width = 960,
            height = 600,
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

        var color = d3.scale.ordinal()
            .domain(Object.keys(dataObj))
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#3D315B", "#444B6E", "#708B75", "#9AB87A", "#F8F991"]);

        function defaultData() {
            var labels = color.domain();
            return labels.map(function(label) {
                return {
                    label: label,
                    value: 1
                }
            });
        }

        function changedData() {
            var labels = color.domain();
            return labels.map(function(label) {
                return {
                    label: label,
                    value: dataObj[label]
                }
            });
        }

        d3.select(".randomize")
            .on("click", function() {
                change(changedData());
            });


        change(defaultData(), function() {
            change(changedData());
        });

        function change(data, callback) {

            /* ------- PIE SLICES -------*/
            var slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(data), key);

            slice.enter()
                .insert("path")
                .style("fill", function(d) {
                    return color(d.data.label);
                })
                .attr("class", "slice")
                .attr("id", function(d) {
                    var temp = d.data.label.replace(/\s|&/g, '');
                    return temp;
                });

            slice
                .transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                })

            slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labels").selectAll("text")
                .data(pie(data), key);

            text.enter()
                .append("text")
                .attr("dy", ".35em")
                .attr("class", function(d) {
                    var temp = d.data.label.replace(/\s|&/g, '');
                    return "pie-labels " + temp;
                })
                .text(function(d) {
                    return d.data.label;
                });

            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
                .attr("class", function(d) {
                    var temp = d.data.label.replace(/\s|&/g, '');
                    return temp;
                })
                .data(pie(data), key);

            polyline.enter()
                .append("polyline")
                .attr("class", function(d) {
                    var temp = d.data.label.replace(/\s|&/g, '');
                    return temp;
                });

            polyline.transition().duration(1000)
                .attrTween("points", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });

            polyline.exit()
                .remove();
            setTimeout(callback, 250);
        };

        $('.pie-labels').each(function(i) {
            var name = $(this).attr("class").split(/\s/g)[1];
            $(this).hide();
            if(topTen.hasOwnProperty(name))
                $(this).show();
        });
        $('polyline').each(function(i) {
            var name = $(this).attr("class");
            $(this).hide();
            if(topTen.hasOwnProperty(name))
                $(this).show();
        });
        $(".slice").mouseenter(function() {
            var id = $(this).attr('id');
            if(!topTen.hasOwnProperty(id))
                $("." + id).show(500);
        });
        $(".slice").mouseout(function() {
            var id = $(this).attr('id');
            if(!topTen.hasOwnProperty(id))
                $("." + id).hide(500);
        });
    },
    destroyView: function() {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();
        this.$el.removeData().unbind();

        // Remove view from DOM
        this.remove();
        Backbone.View.prototype.remove.call(this);
    }
});