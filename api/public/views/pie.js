var PieView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {},
    render: function(e, trackData) {},
    draw: function(obj, data) {
        var svg = d3.select(".main-container")
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

/**
 * var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.call(tip);

d3.csv('aster_data.csv', function(error, data) {

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.score;
    d.width  = +d.weight;
    d.label  =  d.label;
  });
  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
  
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc")
      .attr("stroke", "gray")
      .attr("d", arc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  


  // calculate the weighted mean score
  var score = 
    data.reduce(function(a, b) {
      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
      return a + (b.score * b.weight); 
    }, 0) / 
    data.reduce(function(a, b) { 
      return a + b.weight; 
    }, 0);

  svg.append("svg:text")
    .attr("class", "aster-score")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") // text-align: right
    .text(Math.round(score));

});



body {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar {
  fill: orange;
}

.solidArc:hover {
  fill: orangered ;
}

.solidArc {
    -moz-transition: all 0.3s;
    -o-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
}

.x.axis path {
  display: none;
}

.aster-score { 
  line-height: 1;
  font-weight: bold;
  font-size: 500%;
}

.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}
 Creates a small triangle extender for the tooltip 
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}

Style northward tooltips differently
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
 */
/**
 * index.html#

<!DOCTYPE html>
<meta charset="utf-8">

<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>

<script src="draw.js" ></script>

</body>
</html>
aster_data.csv#

"id","order","score","weight","color","label"
"FIS",1.1,59,0.5,"#9E0041","Fisheries"
"MAR",1.3,24,0.5,"#C32F4B","Mariculture"
"AO",2,98,1,"#E1514B","Artisanal Fishing Opportunities"
"NP",3,60,1,"#F47245","Natural Products"
"CS",4,74,1,"#FB9F59","Carbon Storage"
"CP",5,70,1,"#FEC574","Coastal Protection"
"TR",6,42,1,"#FAE38C","Tourism &  Recreation"
"LIV",7.1,77,0.5,"#EAF195","Livelihoods"
"ECO",7.3,88,0.5,"#C7E89E","Economies"
"ICO",8.1,60,0.5,"#9CD6A4","Iconic Species"
"LSP",8.3,65,0.5,"#6CC4A4","Lasting Special Places"
"CW",9,71,1,"#4D9DB4","Clean Waters"
"HAB",10.1,88,0.5,"#4776B4","Habitats"
"SPP",10.3,83,0.5,"#5E4EA1","Species"
 */