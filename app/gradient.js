var appGradients = function(svg) {
    var getColorShade = function(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var newHex = "#";
        for (var i=0; i<3; i++) {
            var c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            newHex += ("00" + c).substr(c.length);
        }

        return newHex;
    };

    var colors = [
        '#FFA500',
        '#FF4500',
        '#FFFF00',
        '#00ff00',
        '#808000',
        '#00ffff',
        '#dc143c',
        '#00ff00',
        '#800000'
    ];

    var defs = svg.append("defs");

    var gradients = defs
        .selectAll("linearGradient")
        .data(colors)
        .enter()
            .append("linearGradient")
            .attr("id", function(d, i) { return "gradient" + i; })
            .attr("x1", "0")
            .attr("x2", "0")
            .attr("y1", "0")
            .attr("y2", "1")
            .attr("spreadMethod", "pad");

    gradients.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", function(d, i) { return d; })
        .attr("stop-opacity", .9);

    gradients.append("stop")
        .attr("offset", "60%")
        .attr("stop-color", function(d, i) { return d; })
        .attr("stop-opacity", .7);

    gradients.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", function(d, i) { return getColorShade(d, -0.2); })
        .attr("stop-opacity", .6);
};
