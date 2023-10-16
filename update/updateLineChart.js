function updateLineChart(suicideData, inflationData) {
  // Select the SVG element of the line chart
  const data = extractData(suicideData, inflationData, "lineChart");
  const svg = d3.select("#lineChart").select("svg").select("g");
  // Create x and y scales for the chart
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d[0]))
    .range([widthLineChart, 0])
    .padding(1);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1]) + 0.05])
    .range([heightLineChart, 0]);

  // Create a line generator to draw the path based on the data points
  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  // Update the line with the new data points
  svg.select(".line").datum(data).transition().duration(500).attr("d", line);

  // Select all existing circles and bind the data to them
  const circles = svg.selectAll(".circle").data(data);

  // Update existing circles with transitions for position
  circles
    .transition()
    .duration(500)
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]));

  // Add new circles for any new data points and transition them to their correct position
  circles
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]))
    .attr("r", 0)
    .attr("fill", "steelblue")
    .attr("stroke", "black")
    .transition()
    .duration(500)
    .attr("r", 5);

  // Remove any circles that are no longer in the updated data
  circles.exit().transition().duration(500).attr("r", 0).remove();

  // Update the x-axis with the new data points, rotating the labels and adjusting the position
  svg
    .select(".x-axis")
    .transition()
    .duration(500)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .selectAll(".x-axis text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em");

  // Update the y-axis with the new data points, formatting the labels for budget in millions
  svg.select(".y-axis").transition().duration(500).call(
    d3
      .axisLeft(yScale)
      .tickSizeOuter(0)
      .ticks(5)
  );

  // Add tooltips to all circles with the movie title as the content
  svg
    .selectAll(".circle")
    // .on("mouseover", handleMouseOverChoropleth) 
    // .on("mouseout", handleMouseOutChoropleth) 
    .append("title")
    .text((d) => "text TODO");
}
