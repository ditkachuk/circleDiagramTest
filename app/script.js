var app = function() {
    var self = this;
    var w, h, radius, maxRadius, rIndent = 45;

    self.clearRender = function() {
        w = window.innerWidth;
        h = window.innerHeight;
        radius = Math.min(w, h) / 2;
        maxRadius = Math.max(w, h) / 2;

        if (self.root) self.root.remove();
        self.root = d3.select('body').append('svg');
    };

    self.renderBackground = function() {
        for(var i = 0; i < 20; i++) {
            self.root.append("circle")
                .attr("r", rIndent + i * rIndent - rIndent)
                .attr("cx", w/2)
                .attr("cy", h/2)
                .attr("class", "backCircle")
                .attr('fill', 'none')
                .attr("stroke", "#eee")
                .attr("stroke-opacity", .4)
                .attr("stroke-dasharray", "3,8");
        }
    };

    self.renderErrorText = function() {
        return self.root.append("text")
            .attr("text-anchor", "middle")
            .attr("x", w/2)
            .attr("y", h/2)
            .text('Error. No data loaded.');
    };

    self.renderData = function(data) {
        if (!data) return;

        var endArc = 2 * Math.PI,
            startRadius = ((radius / rIndent - 1).toFixed(0) )* rIndent;

        self.data = self.sortData(data);

        for(var i = 0; i < self.data.length; i++) {
            var arcRadius = Math.max(startRadius - self.data[i].order * rIndent, 3 * rIndent),
                value = (self.data[i].val * 360).toFixed(0);
            
            var g = self.root.append("g")
                .attr("transform", "translate(" + w/2 + "," + h/2 + ")");

            var arc = d3.arc()
                .outerRadius(arcRadius)
                .innerRadius(0)
                .endAngle(endArc);

            endArc = endArc - value / 360 * Math.PI * 2;

            arc.startAngle(endArc);

            g.append("path")
                .attr("id", "pie" + i)
                .attr("d", arc)
                .attr("fill",  "url(#gradient" + i + ")");

            var text = g.append("text")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })

            text.append("tspan")
                .attr("text-anchor", "middle")
                .attr('x', 35)
                .attr('y', 0)
                .text(self.data[i].value + '%');

            if (self.data[i].val > .2) {
                text.append("tspan")
                    .attr("text-anchor", "middle")
                    .attr('x', 35)
                    .attr('y', 0)
                    .attr('dy', '1em')
                    .text(self.data[i].name);
            }
        }
    };

    self.loadData = function() {
        if (self.errorText) self.errorText.remove();
        d3.json("/app/data.json", function(error, root) {
            if (error) {
                self.errorText = self.renderErrorText();
                return;
            }

            self.pies = self.renderData(root.data);
        });
    };

    self.sortData = function(data) {
        var notSorted = [],
            sum = 0;
        for(var i = 0; i < data.length; i++) {
            sum += data[i].value;
            data[i].index = i;
            notSorted[i] = data[i];
        }

        var sortedData = data.sort(function(a,b) {
            return b.value - a.value;
        });

        for(var i = 0; i < sortedData.length; i++) {
            notSorted[sortedData[i].index].order = i;
            notSorted[sortedData[i].index].val = notSorted[sortedData[i].index].value / sum;
        }

        return notSorted;
    };

    self.render = function() {
        self.clearRender();
        appGradients(self.root);
        self.renderBackground();
        self.renderData(self.data);
    };

    self.init = function() {
        self.render();
        self.loadData();
    };

    self.init();

    return self;
};

window.onload = function() {
    window.app = app();

    window.onresize = function() {
        window.app.render();
    };
};
