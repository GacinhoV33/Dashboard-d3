function handleMouseOverChoropleth(event, item) {
  // Select all elements with class "data" and filter based on the item's properties
  showChoroplethTooltip(event, item);
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
    .attr("stroke", "lime")
    .attr("cursor", "pointer");
}

function handleMouseOutChoropleth(event, item) {
  const currentData = calcSuicideRatioForCountries(
    filterSuicideData(),
    globalDataForestIncomeInflation
  );

  // Create a color scale for the suicide ratio values
  const colorScale = d3.scaleQuantize(
    [d3.min(Object.values(currentData)), d3.max(Object.values(currentData))],
    d3.schemeBlues[9]
  );

  // Reset the fill color of all elements with class "country data" to black, except highlighted one
  d3.selectAll(".country.data")
    .filter((item) => !highlightedItems.includes(item.properties.name))
    .attr("stroke", "#DDD");

  // Set the fill color of each country based on its suicide ratio value
  Object.entries(currentData).forEach((element) => {
    d3.selectAll(".country.data")
      .filter(function (d) {
        return d.properties.name == element[0];
      })
      .attr("fill", colorScale(element[1]));
  });
  document.getElementById("d3_tooltip").style.opacity = 0;
}

function showChoroplethTooltip(event, item) {
  document.getElementById("d3_tooltip").style.opacity = 1;
  document.getElementById("d3_tooltip").style.left = `${event.clientX + 20}px`;
  document.getElementById("d3_tooltip").style.top = `${event.clientY}px`;

  // show data if it is, otherwise show not available text
  if (Object.keys(filteredYearDataSuicide).includes(item.properties.name)) {
    document.getElementById(
      "d3_header"
    ).textContent = `${item.properties.name}`;
    document.getElementById("d3_suicide_ratio").textContent = `suicide_ratio ${
      filteredYearDataSuicide[item.properties.name]
    }\u2030`;
    document.getElementById("d3_inflation").textContent = "inflation";
    document.getElementById("d3_forest_area").textContent = "forest area";
    document.getElementById("d3_income").textContent = "income";
  } else {
    document.getElementById(
      "d3_header"
    ).textContent = `${item.properties.name}`;
    document.getElementById(
      "d3_suicide_ratio"
    ).textContent = `Data not available`;
    document.getElementById("d3_inflation").textContent = "";
    document.getElementById("d3_forest_area").textContent = "";
    document.getElementById("d3_income").textContent = "";
  }
}
