var PieView = Backbone.View.extend({
    el: $('.main-container'),
    initialize: function() {
    },
    render: function() {
        var genreArtistMap = JSON.parse(localStorage.getItem("genreArtistMap"));
        var data = JSON.parse(localStorage.getItem("pieData"));
        var topTen = JSON.parse(localStorage.getItem("topTen"));
        var obj = {};
        for (var i = 0; i < topTen.length; i++) {
            topTen[i] = topTen[i].replace(/\s|&/g, '');
            obj[topTen[i]] = true;
        }
        console.log(topTen);
        this.draw(data, obj, genreArtistMap);
    },
    draw: function(dataObj, topTen, genreArtistMap) {
        var modalTemplate = Handlebars.templates['piemodal'];
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function(d) {
                d.data.value = d.value;
                return d.data.label + ": " + dataObj[d.data.label];
            });

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

        svg.call(tip);



        var width = $(window).width()-175,
            height = $(window).height(),
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
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);// "#3D315B", "#444B6E", "#708B75", "#9AB87A", "#F8F991"]);

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
            Loading.stop();
            var labels = color.domain();
            return labels.map(function(label) {
                return {
                    label: label,
                    value: dataObj[label]
                }
            });
        }

        change(defaultData(), function() {
            change(changedData());
        });

        function change(data, callback) {
            /* ------- PIE SLICES -------*/
            var slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(data), key);

            slice.enter()
                .insert("path")
                .attr("fill", function(d) {
                    return color(d.data.label);
                })
                .attr("class", "slice")
                .attr("id", function(d) {
                    var temp = d.data.label.replace(/\s|&/g, '');
                    return temp;
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on('click', function(d){
                    //genreArtistMap
                    d.data.artistList = genreArtistMap[d.data.label];
                    $('#pie-modal').html(modalTemplate(d.data));
                    $('#pie-modal').modal('show');
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

            setTimeout(callback, 250);
        };
    },
    destroyView: function() {
        // COMPLETELY UNBIND THE VIEW
        this.$el.removeData().unbind();

        // Remove view from DOM
        this.remove();
        Backbone.View.prototype.remove.call(this);
    }
});