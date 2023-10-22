function handleMouseOverChoropleth(event, item) {
  // Select all elements with class "data" and filter based on the item's properties
  showTooltip(event, item);
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
    .style("opacity", 1)
    .attr("stroke", "red")
    .attr("cursor", "pointer");

  // Custom chart stuff
  d3.selectAll(".circle")
    .filter((d) => item.properties.name === d[0])
    .attr("stroke", "red")
    .style("opacity", 1);
}

function handleMouseOutChoropleth(event, item) {
  // Reset the fill color of all elements with class "country data" to black, except highlighted one
  d3.selectAll(".country.data")
    .filter(
      (d) =>
        !highlightedItems.includes(d.properties.name) &&
        availableCountries.includes(d.properties.name)
    )
    .style("opacity", 0.15);

  d3.selectAll(".country.data")
    .filter((d) => item.properties.name === d.properties.name)
    .attr("stroke", "#DDD");

  document.getElementById("d3_tooltip").style.opacity = 0;

  // Custom chart stuff
  d3.selectAll(".circle")
    .filter((d) => d[0] === item.properties.name)
    .attr("stroke", "black")
    .filter((d) => !highlightedItems.includes(d[0]))
    .style("opacity", 0.15);

}

function showTooltip(event, item) {
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
    document.getElementById("d3_inflation").textContent = `Inflation - ${
      filteredYearForestIncomeNNIData[item.properties.name].inflation
    }%`;
    document.getElementById("d3_forest_area").textContent = `Forest area - ${
      filteredYearForestIncomeNNIData[item.properties.name].forest_area
    }%`;
    document.getElementById("d3_income").textContent = `Adjusted NNI - ${
      filteredYearForestIncomeNNIData[item.properties.name].adjusted_nni
    }$`;
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
