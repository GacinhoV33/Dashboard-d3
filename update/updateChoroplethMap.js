function updateChoroplethChart(suicideData) {
  // get data
  var currentData = calcSuicideRatioForCountries(suicideData);

  const colorScale = d3.scaleQuantize(
    [0, 0.34],
    d3.schemeBlues[9]
  );
  // print countries based on new suicide_ratio
  Object.entries(currentData).forEach((element) => {
    d3.selectAll(".country.data")
      .filter(function (d) {
        return d.properties.name == element[0];
      })
      .attr("fill", colorScale(element[1]))
  });
  
  d3.selectAll(".country.data").filter((d) => !highlightedItems.includes(d.properties.name) && availableCountries.includes(d.properties.name)).style("opacity", 0.15);
  d3.selectAll(".country.data").filter((d) => highlightedItems.includes(d.properties.name)).style("opacity", 1);
  // add the animation?
}
