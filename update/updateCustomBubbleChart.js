function updateCustomBubbleChart(suicideData, inflationData) {
  var currentDataFiltered = calcForestNNIInflationRatio(
    suicideData,
    inflationData
  );
  var suicideDataFiltered = calcSuicideRatioForCountries(
    suicideData,
    inflationData
  );

  var scaleDataInflation = calcForestNNIInflationRatio(
    globalDataSuicide,
    globalDataForestIncomeInflation
  );
  var scaleDataSuicide = calcSuicideRatioForCountries(
    globalDataSuicide,
    globalDataForestIncomeInflation
  );
  var mergedData = mergeTwoRatios(suicideDataFiltered, currentDataFiltered);
  var mergedDataExtracted = Object.entries(mergedData);

  var scaleMergedData = mergeTwoRatios(scaleDataSuicide, scaleDataInflation);
  var scaleDataExtracted = Object.entries(scaleMergedData);

  const svg = d3.select("#customChart").select("svg").select("g");

  const circles = svg.selectAll(".circle").data(mergedDataExtracted);

  // Update existing circles with transitions for position

  const xScale = d3.scaleLinear().domain([-7, 32]).range([0, widthCustom]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(scaleDataExtracted, (d) => d[1].suicide_ratio),
      d3.max(scaleDataExtracted, (d) => d[1].suicide_ratio),
    ])
    .range([heightCustom, 0]);

  const rScale = d3
    .scaleLinear()
    .domain([
      d3.min(scaleDataExtracted, (d) => d[1].adjusted_nni),
      d3.max(scaleDataExtracted, (d) => d[1].adjusted_nni),
    ])
    .range([3, 15]);

  const colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(scaleDataExtracted, (d) => d[1].forest_area),
      d3.max(scaleDataExtracted, (d) => d[1].forest_area),
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
    );

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
    .duration(500);

  // Remove any circles that are no longer in the updated data
  circles.exit().transition().duration(500).attr("r", 0).remove();
  svg
    .selectAll(".circle")
    .on("mouseover", handleMouseOverCustom)
    .on("mouseout", handleMouseOutCustom)
    .on("click", onClickBubble);
}
