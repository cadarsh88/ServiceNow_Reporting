function() {
  /* widget controller */
  var c = this;
	
	var svg = d3.select("svg"),
          margin = {top: 20, right: 20, bottom: 120, left: 60},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
          y = d3.scaleLinear().rangeRound([height, 0]);

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
      var userName = "read_only";
      var authToken = "3c6B6u8a1Y4p8o1R7s5w";

      var selectedTable = "";
      var selectedDomain = "";
      var selectedRange = "";
      
      populateTableOptions();
              
      populateDomainAndRangeOptions();

      function populateTableOptions() {
      
        d3.json("http://localhost:8153/api.rsc/")
          .header("Authorization", "Basic " + btoa(userName + ":" + authToken))
          .get(function(error, data) {
            if (error) throw error;
            
            var values = data.value;
        
            d3.select("select.tableSelect")
              .on('change', function() {
                clearChart();
                selectedTable = d3.select("select.tableSelect").property("value");
                populateDomainAndRangeOptions(selectedTable);
                d3.select("button.dataButton")
                .text(function(d) {
                  return "Get [" + selectedTable + "] Data"; 
                });
              })
              .selectAll('option')
              .data(values)
              .enter().append("option")
              .text(function(d) {
                return d.name; 
              });
            
            selectedTable = d3.select("select.tableSelect").property("value");
            
            d3.select("button.dataButton")
              .on('click', function() {
                clearChart();
                buildChart();
              })
              .text(function(d) {
                return "Get [" + selectedTable + "] Data"; 
              });
          });                
      }

      function populateDomainAndRangeOptions() {

        d3.json("http://localhost:8153/api.rsc/" + selectedTable + "/$metadata?@json")
          .header("Authorization", "Basic " + btoa(userName+":"+authToken))
          .get(function(error, data) {
            if (error) throw error;
            populateColumnOptions(data);
            selectedDomain = d3.select("select.domainSelect").property("value");
            selectedRange = d3.select("select.rangeSelect").property("value");
          });
      }

      function populateColumnOptions(data) {
        
        var values = data.items[0]["odata:cname"];
        var axes = ["domain", "range"];
        
        axes.forEach(function(axis) {
        
          d3.select("select." + axis + "Select")
            .selectAll("*")
            .remove();
          
          d3.select("select." + axis + "Select")
            .on('change', function() {
              clearChart();
              if (axis == "domain")
                selectedDomain = d3.select("select." + axis + "Select").property("value");
              else if (axis == "range")
                selectedRange = d3.select("select." + axis + "Select").property("value");
            })
            .selectAll('option')
            .data(values)
            .enter().append("option")
            .text(function(d) {
              return d; 
            });
        });
      }

      function buildChart() {

        d3.json("http://localhost:8153/api.rsc/" + selectedTable + "/?$select=" + selectedDomain + "," + selectedRange + "&$top=20")
            .header("Authorization", "Basic " + btoa(userName + ":" + authToken))
            .get(function(error, data) {
              if (error) throw error;
              
              var values = data.value;
              
              x.domain(values.map(function(d) { return d[selectedDomain].toString(); }));
              y.domain([0, d3.max(values, function(d) { return d[selectedRange]; })]);

              g.append("g")
                  .attr("class", "axis axis--x")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x));
                  
              g.selectAll("g.tick")
                  .attr("text-anchor", "end")
                  .selectAll("text")
                  .attr("transform", "rotate(-45)");

              g.append("g")
                  .attr("class", "axis axis--y")
                  .call(d3.axisLeft(y))
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", "0.71em")
                  .attr("text-anchor", "end")
                  .text("Value");

              g.selectAll(".bar")
                .data(values)
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d[selectedDomain].toString()); })
                  .attr("y", function(d) { return y(d[selectedRange]); })
                  .attr("width", x.bandwidth())
                  .attr("height", function(d) { return height - y(d[selectedRange]); })
                  .attr("title", function(d) { return d[selectedRange]; })
                  .text(function(d) { return d[selectedRange]; });
            });
        
      }
      
      function clearChart() {

        d3.select("svg")
          .select("g")
          .selectAll("*")
          .remove();
      
      }

}