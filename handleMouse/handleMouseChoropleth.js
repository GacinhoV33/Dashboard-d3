function handleMouseOverChoropleth(event, item) {
  // Select all elements with class "data" and filter based on the item's properties
  d3.selectAll(".data")
    .filter(function (d) {
      // Check if "properties" exist in both item and d objects
      if ("properties" in item) {
        if ("properties" in d) return item.properties.name == d.properties.name;
        else return item.properties.name == d.country;
      } else if ("properties" in d) {
        return item.country == d.properties.name;
      } else {
        return item.country == d.country;
      }
    })
    .attr("fill", "red")// Change the fill color of the matching element
    .attr("cursor", "pointer")
}

function handleMouseOutChoropleth(event, item) {
  const data = calcRatioForCountries(
    globalDataSuicide,
    globalDataForestIncomeInflation
  );
  
  // we are not affecting items that are currently highlighted
  if (highlightedItems.length > 0) {
    var currentData = Object.fromEntries(
      Object.entries(data).filter((key) =>
        !highlightedItems.includes(key[0])
      )
    );
  } else {
    var currentData = data;
  }

  // Create a color scale for the suicide ratio values
  const colorScale = d3
    .scaleLog()
    .domain([
      d3.min(Object.values(currentData)),
      d3.max(Object.values(currentData)),
    ])
    .range([0, 1]);

  // Reset the fill color of all elements with class "country data" to black, except highlighted one
  d3.selectAll(".country.data").filter((item) => !highlightedItems.includes(item.properties.name)).attr("fill", "black");

  // Set the fill color of each country based on its suicide ratio value
  Object.entries(currentData).forEach((element) => {
    d3.selectAll(".country.data")
      .filter(function (d) {
        return d.properties.name == element[0];
      })
      .attr("fill", d3.interpolateBlues(colorScale(element[1])));
  });

  // Reset the fill color of all elements with class "circle data" to steelblue
  d3.selectAll("circle.data").attr("fill", "steelblue");
}
