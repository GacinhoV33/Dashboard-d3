function handleMouseOverCustom(event, item) {
  d3.selectAll(".circle")
    .style("cursor", "pointer")
    .filter((d) => item[0] === d[0])
    .attr("stroke", "red");

  d3.selectAll(".country.data")
    .filter((d) => item[0] === d.properties.name)
    .attr("stroke", "red");

  showTooltipCustom(event, item);
}

function handleMouseOutCustom(event, item) {
  d3.selectAll(".circle").attr("stroke", (d) =>
    highlightedItems.includes(d[0]) ? "lime" : "black"
  );

  d3.selectAll(".country.data")
    .filter((d) => item[0] === d.properties.name)
    .attr("stroke", highlightedItems.includes(item[0]) ? "lime" : "#DDD");

  document.getElementById("d3_tooltip").style.opacity = 0;
}

function onClickBubble(event, item) {
  if (highlightedItems.length === 71) {
    highlightedItems = [item[0]];
  } else {
    if (highlightedItems.includes(item[0])) {
      const index = highlightedItems.indexOf(item[0]);
      highlightedItems.splice(index, 1);
    } else {
      if (availableCountries.includes(item[0])) {
        highlightedItems.push(item[0]);
      }
    }
  }

  updateLineChart(filterSuicideData());

  updateChoroplethChart(filterSuicideData());
  d3.selectAll(".country.data")
    .filter((item) => !highlightedItems.includes(item.properties.name))
    .attr("stroke", "#DDD");

  updateCustomBubbleChart(
    filterSuicideData(),
    filterGlobalDataForestIncomeInflation()
  );
}

function showTooltipCustom(event, item) {
  document.getElementById("d3_tooltip").style.opacity = 1;
  document.getElementById("d3_tooltip").style.left = `${event.clientX + 20}px`;
  document.getElementById("d3_tooltip").style.top = `${event.clientY}px`;

  // show data if it is, otherwise show not available text
  console.log(item);
  if (Object.keys(filteredYearDataSuicide).includes(item[0])) {
    document.getElementById("d3_header").textContent = `${item[0]}`;
    document.getElementById("d3_suicide_ratio").textContent = `suicide_ratio ${
      filteredYearDataSuicide[item[0]]
    }\u2030`;
    document.getElementById("d3_inflation").textContent = "inflation";
    document.getElementById("d3_forest_area").textContent = "forest area";
    document.getElementById("d3_income").textContent = "income";
  } else {
    document.getElementById("d3_header").textContent = `${item[0]}`;
    document.getElementById(
      "d3_suicide_ratio"
    ).textContent = `Data not available`;
    document.getElementById("d3_inflation").textContent = "";
    document.getElementById("d3_forest_area").textContent = "";
    document.getElementById("d3_income").textContent = "";
  }
}
