$( document ).ready(function() {
   startD31();
   startD32();
   startD33();
   startD34();
});

function startD31() {

// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 40, left: 50},
        width = 520 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

// Add the grey background that makes ggplot2 famous
    svg
        .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("height", height)
        .attr("width", height)
        .style("fill", "EBEBEB")

//Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

        // Add X axis
        var x = d3.scaleLinear()
            .domain([4*0.95, 8*1.001])
            .range([ 0, width ])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
            .select(".domain").remove()

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-0.001, 9*1.01])
            .range([ height, 0])
            .nice()
        svg.append("g")
            .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
            .select(".domain").remove()

        // Customization
        svg.selectAll(".tick line").attr("stroke", "white")

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + margin.left)
            .attr("y", height + margin.top + 20)
            .text("Sepal Length");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height/2 + 20)
            .text("Petal Length")

        // Color scale: give me a specie name, I return a color
        var color = d3.scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica" ])
            .range([ "#F8766D", "#00BA38", "#619CFF"])

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Sepal_Length); } )
            .attr("cy", function (d) { return y(d.Petal_Length); } )
            .attr("r", 5)
            .style("fill", function (d) { return color(d.Species) } )

    })
}

function startD32(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#my_dataviz2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {

        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Y axis: initialization
        var y = d3.scaleLinear()
            .range([height, 0]);
        var yAxis = svg.append("g")

        // A function that builds the graph for a specific value of bin
        function update(nBin) {

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function(d) { return d.price; })   // I need to give the vector of value
                .domain(x.domain())  // then the domain of the graphic
                .thresholds(x.ticks(nBin)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            // Y axis: update now that we know the domain
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
            yAxis
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y));

            // Join the rect with the bins data
            var u = svg.selectAll("rect")
                .data(bins)

            // Manage the existing bars and eventually the new ones:
            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .merge(u) // get the already existing elements as well
                .transition() // and apply changes to all of them
                .duration(1000)
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#69b3a2")


            // If less bar in the new histogram, I delete the ones not in use anymore
            u
                .exit()
                .remove()

        }


        // Initialize with 20 bins
        update(20)


        // Listen to the button -> update if user change it
        d3.select("#nBin").on("input", function() {
            update(+this.value);
        });

    });
}

function startD33() {
// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#my_dataviz3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {

        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(d) { return d.price; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(70)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svg.append("g")
            .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})

        // Append a vertical line to highlight the separation
        svg
            .append("line")
            .attr("x1", x(140) )
            .attr("x2", x(140) )
            .attr("y1", y(0))
            .attr("y2", y(1600))
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
        svg
            .append("text")
            .attr("x", x(190))
            .attr("y", y(1400))
            .text("threshold: 140")
            .style("font-size", "15px")

    });
}

function startD34() {

// set the dimensions and margins of the graph
    var width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#my_dataviz4")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
    var data = {a: 9, b: 20, c:30, d:8, e:12};

// set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeSet2);

// Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function(d) {return d.value; });
    var data_ready = pie(d3.entries(data));
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

// Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return "grp " + d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17);

}

// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

