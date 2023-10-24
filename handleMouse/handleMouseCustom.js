function handleMouseOverCustom(event, item) {
  d3.selectAll(".circle")
    .style("cursor", "pointer")
    .filter((d) => item[0] === d[0])
    .attr("stroke", "red")
    .style("opacity", 1);

  d3.selectAll(".country.data")
    .filter((d) => item[0] === d.properties.name)
    .attr("stroke", "red")
    .style("opacity", 1);

  showTooltipCustom(event, item);
}

function handleMouseOutCustom(event, item) {
  d3.selectAll(".circle")
    .filter((d) => d[0] === item[0])
    .attr("stroke", "none")
    .filter((d) => !highlightedItems.includes(d[0]))
    .style("opacity", 0.15);

  // Choropleth Stuff
  d3.selectAll(".country.data")
    .filter((d) => item[0] === d.properties.name)
    .attr("stroke", "#888");

  d3.selectAll(".country.data")
    .filter(
      (d) =>
        !highlightedItems.includes(d[0]) && availableCountries.includes(d[0])
    )
    .style("opacity", 0.15);
  // Move position of tooltip so that it not hide elements of dashboard
  document.getElementById("d3_tooltip").style.left = 0;
  document.getElementById("d3_tooltip").style.top = 0;
  document.getElementById("d3_tooltip").style.opacity = 0;
}

function onClickBubble(event, item) {
  if (highlightedItems.length === 71) {
    highlightedItems = [item[0]];
  } else {
    if (highlightedItems.includes(item[0])) {
      const index = highlightedItems.indexOf(item[0]);
      highlightedItems.splice(index, 1);
      if (highlightedItems.length === 0) {
        highlightedItems = availableCountries;
      }
    } else {
      if (availableCountries.includes(item[0])) {
        highlightedItems.push(item[0]);
      }
    }
  }

  updateLineChart(
    globalDataSuicide
      .filter((item) => highlightedItems.includes(item.country))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );

  updateChoroplethChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );

  updateCustomBubbleChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      ),
    globalDataForestIncomeInflation.filter((item) =>
      yearsArray.includes(item.year)
    )
  );
  updatePyramidChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter((item) => highlightedItems.includes(item.country))
  );

  calcTooltipData();
}

function showTooltipCustom(event, item) {
  document.getElementById("d3_tooltip").style.opacity = 1;
  document.getElementById("d3_tooltip").style.left = `${event.clientX + 20}px`;
  document.getElementById("d3_tooltip").style.top = `${event.clientY}px`;

  // show data if it is, otherwise show not available text
  if (Object.keys(tooltipSuicideData).includes(item[0])) {
    document.getElementById("d3_header").textContent = `${item[0]}`;
    document.getElementById("d3_suicide_ratio").textContent = `Suicide ratio ${
      tooltipSuicideData[item[0]]
    }\u2030`;
    document.getElementById("d3_inflation").textContent = `Inflation - ${
      tooltipForestIncomeInflationData[item[0]].inflation
    }%`;
    document.getElementById("d3_forest_area").textContent = `Forest area - ${
      tooltipForestIncomeInflationData[item[0]].forest_area
    }%`;
    document.getElementById("d3_income").textContent = `Adjusted NNI - ${
      tooltipForestIncomeInflationData[item[0]].adjusted_nni
    }$`;
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
