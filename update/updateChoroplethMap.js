function updateChoroplethChart(suicideData, inflationData) {
  // get data
  var currentData = calcRatioForCountries(suicideData, inflationData);

  const colorScale = d3
    .scaleLog()
    .domain([
      d3.min(Object.values(currentData)),
      d3.max(Object.values(currentData)),
    ])
    .range([0, 1]);
  // make all countries black
  d3.selectAll(".country.data")
    .filter((item) => !highlightedItems.includes(item.properties.name))
    .attr("fill", "black");

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
  // d3.append("#choroplethTitle");

  createChoroplethLegend(currentData);
  // add the animation?

  // adding lines to keep highlighted items red even though data years were changed

  d3.selectAll(".data")
    .filter(function (d) {
      // Check if "properties" exist in both item and d objects
      if ("properties" in d)
        return highlightedItems.includes(d.properties.name);
      else return highlightedItems.includes(d.country);
    })
    .attr("fill", "red") // Change the fill color of the matching element
    .attr("cursor", "pointer");
}
