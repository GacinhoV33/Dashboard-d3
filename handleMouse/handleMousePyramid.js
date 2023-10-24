var selectedClass = "none";

function handlePyramidMouseOver(event, item) {
  if (event.screenX > 1430) {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barFemale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "red").style("stroke", "white");
    selectedClass = "female";
  } else {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barMale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "red").style("stroke", "white");
    selectedClass = "male";
  }
}

function handlePyramidMouseOut(event, item) {
  if (selectedClass === "male") {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barMale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "#18375F").style("stroke", "black");
  } else if (selectedClass === "female") {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barFemale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "#0072BC").style("stroke", "black");
  } else {
    console.log("Something when wrong on hovering");
  }
}

function handleClickMale(event, item) {
  if (ageGroupsMale.length === 6) {
    ageGroupsMale = [item.ages];
  } else if (ageGroupsMale.includes(item.ages)) {
    // ageGroupsMale = ageGroupsMale.filter((d) => d === item.ages);
    const index = ageGroupsMale.indexOf(item.ages);
    ageGroupsMale = ageGroupsMale.splice(index, 1);
  } else {
    ageGroupsMale.push(item.ages);
  }

  updateCharts();
}

function handleClickFemale(event, item) {
  if (ageGroupsFemale.length === 6) {
    ageGroupsFemale = [item.ages];
  } else if (ageGroupsFemale.includes(item.ages)) {
    // ageGroupsFemale = ageGroupsFemale.filter((d) => d === item.ages);
    const index = ageGroupsFemale.indexOf(item.ages);
    ageGroupsFemale = ageGroupsFemale.splice(index, 1);
  } else {
    ageGroupsFemale.push(item.ages);
  }
  updateCharts();
}

function handleClickSexFemale() {
  ageGroupsFemale = [
    "5-14 years",
    "15-24 years",
    "25-34 years",
    "35-54 years",
    "55-74 years",
    "75+ years",
  ];
  ageGroupsMale = [];

  updateCharts();
}

function handleClickSexMale() {
  ageGroupsMale = [
    "5-14 years",
    "15-24 years",
    "25-34 years",
    "35-54 years",
    "55-74 years",
    "75+ years",
  ];
  ageGroupsFemale = [];
  updateCharts();
}

function updateCharts() {
  updateLineChart(
    globalDataSuicide
      .filter((d) => highlightedItems.includes(d.country))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );

  updateChoroplethChart(
    globalDataSuicide
      .filter((d) => yearsArray.includes(d.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );

  updateCustomBubbleChart(
    globalDataSuicide
      .filter((d) => yearsArray.includes(d.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      ),
    globalDataForestIncomeInflation.filter((d) => yearsArray.includes(d.year))
  );

  updatePyramidChart(
    globalDataSuicide
      .filter((d) => highlightedItems.includes(d.country))
      .filter((d) => yearsArray.includes(d.year))
  );

  calcTooltipData();

}
