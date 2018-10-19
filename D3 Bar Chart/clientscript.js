function() {

                      /* widget controller */

                      var c = this;

               

                      // Define our hard-coded data

                      var data = c.data.categories;

               

                      // Set the width of the chart along with the height of each bar

                      var width = c.options.width,

                      barHeight = c.options.bar_height,

                      leftMargin = c.options.left_margin;

               

                      var chart = d3.select(".chart")

                      .attr("width", width)

                      .attr("height", barHeight * data.length + 50);

               

                      // Set the domain and range of the chart

                      var x = d3.scaleLinear()

                      .range([leftMargin, width])

                      .domain([0, d3.max(data, function(d) { return d.value; })]);

               

                      // Add a g container for each row from our data

                      var bar = chart.selectAll("g")

                      .data(data)

                      .enter().append("g")

                      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

               

                      // Add a rectangle element with the width based off of the value from that row of data

                      bar.append("rect")

                      .attr("width", function(d) { return x(d.value) - leftMargin; })

                      .attr("height", barHeight - 1)

                      .attr("x", leftMargin);

               

                      // Add text elements to serve as labels of our categories

                      bar.append("text")

                      .attr("x", leftMargin - 5)

                      .attr("y", barHeight / 2)

                      .attr("width", leftMargin)

                      .attr("dy", ".35em")

                      .style("fill", "black")

                      .style("text-anchor", "end")

                      .text(function(d) { return d.category; });

               

                      // Create the x-axis and append it to the bottom of the chart

                      var xAxis = d3.axisBottom().scale(x);

               

                      chart.append("g")

                      .attr("class", "x axis")

                      .attr("transform", "translate(0," + (barHeight * data.length) + ")")

                      .attr("x", leftMargin)

                      .call(xAxis);

               

}