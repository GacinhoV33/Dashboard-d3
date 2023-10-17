function updateCustomBubbleChart(suicideData, inflationData) {
  var currentDataFiltered = calcForestNNIInflationRatio(
    suicideData,
    inflationData
  );
  var suicideDataFiltered = calcSuicideRatioForCountries(
    suicideData,
    inflationData
  );
  var mergedData = mergeTwoRatios(suicideDataFiltered, currentDataFiltered);
  var mergedDataExtracted = Object.entries(mergedData);

  const svg = d3.select("#customChart").select("svg").select("g");

  const circles = svg.selectAll(".circle").data(mergedDataExtracted);

  // Update existing circles with transitions for position

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].inflation),
      d3.max(mergedDataExtracted, (d) => d[1].inflation),
    ])
    .range([0, widthCustom]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].suicide_ratio),
      d3.max(mergedDataExtracted, (d) => d[1].suicide_ratio),
    ])
    .range([heightCustom, 0]);

  const rScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].adjusted_nni),
      d3.max(mergedDataExtracted, (d) => d[1].adjusted_nni),
    ])
    .range([3, 15]);

  const colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].forest_area),
      d3.max(mergedDataExtracted, (d) => d[1].forest_area),
    ])
    .range([0, 1]);

  circles
    .transition()
    .duration(500)
    .attr("cx", (d) => xScale(d[1].inflation))
    .attr("cy", (d) => yScale(d[1].suicide_ratio))
    .attr("r", (d) => rScale(d[1].adjusted_nni))
    .attr("fill", (d) =>
      d3.interpolateGreens(Number(colorScale(d[1].forest_area)))
    )
 
  circles
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d[1].inflation))
    .attr("cy", (d) => yScale(d[1].suicide_ratio))
    .attr("r", (d) => rScale(d[1].adjusted_nni))
    .attr("fill", (d) =>
      d3.interpolateGreens(Number(colorScale(d[1].forest_area)))
    )
    .transition()
    .duration(500)

  // Remove any circles that are no longer in the updated data
  circles.exit().transition().duration(500).attr("r", 0).remove();

  //update axises
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

  svg
    .select(".y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(yScale).tickSizeOuter(0).ticks(5));
}
