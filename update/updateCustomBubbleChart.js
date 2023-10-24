function updateCustomBubbleChart(suicideData, inflationData) {
  var currentDataFiltered = calcForestNNIInflationRatio(
    inflationData
  );
  var suicideDataFiltered = calcSuicideRatioForCountries(suicideData);
  var mergedData = mergeTwoRatios(suicideDataFiltered, currentDataFiltered);
  var mergedDataExtracted = Object.entries(mergedData);
  const svg = d3.select("#customChart").select("svg").select("g");

  const circles = svg.selectAll(".circle").data(mergedDataExtracted);

  // Update existing circles with transitions for position

  const xScale = d3.scaleLinear().domain([-5, 19]).range([0, widthCustom]);

  const yScale = d3.scaleLinear().domain([0, 0.60]).range([heightCustom, 0]);

  const rScale = d3.scaleLinear().domain([925.5, 4032000]).range([2, 18]);

  const colorScale = d3.scaleQuantize([0, 100], d3.schemeGreens[9]);
  circles
    .transition()
    .duration(500)
    .attr("cx", (d) => xScale(d[1].inflation))
    .attr("cy", (d) => yScale(d[1].suicide_ratio))
    .attr("r", (d) => rScale(d[1].adjusted_nni))
    .attr("fill", (d) =>
      colorScale(d[1].forest_area)
    );

  circles
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d[1].inflation))
    .attr("cy", (d) => yScale(d[1].suicide_ratio))
    .attr("r", (d) => rScale(d[1].adjusted_nni))
    .attr("fill", (d) =>
      colorScale(d[1].forest_area)
    )
    // .attr("stroke", "black")
    .transition()
    .duration(500);

  svg
    .selectAll(".circle")
    .filter((d) => !highlightedItems.includes(d[0]))
    .style("opacity", 0.15);
  svg
    .selectAll(".circle")
    .filter((d) => highlightedItems.includes(d[0]))
    .style("opacity", 1);
  // Remove any circles that are no longer in the updated data
  circles.exit().transition().duration(500).attr("r", 0).remove();
  svg
    .selectAll(".circle")
    .on("mouseover", handleMouseOverCustom)
    .on("mouseout", handleMouseOutCustom)
    .on("click", onClickBubble);
}
