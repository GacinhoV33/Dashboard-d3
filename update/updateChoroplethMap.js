function updateChoroplethChart(suicideData, inflationData) {
  // get data
  var currentData = calcSuicideRatioForCountries(suicideData, inflationData);

  const colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(Object.values(currentData)),
      d3.max(Object.values(currentData)),
    ])
    .range([0, 1]);
  // make all countries black

  // print countries based on new suicide_ratio
  Object.entries(currentData).forEach((element) => {
    d3.selectAll(".country.data")
      .filter(function (d) {
        return d.properties.name == element[0];
      })
      .attr("fill", d3.interpolateBlues(colorScale(element[1])));
  });
  // change scale based on new suicide_ratio
  d3.select("#choroplethTitle").select("svg").remove();

  createChoroplethLegend(currentData);
  // add the animation?

  // adding lines to keep highlighted items red even though data years were changed
}
