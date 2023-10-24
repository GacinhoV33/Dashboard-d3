function clearAllFilters() {
  highlightedItems = availableCountries;
  ageGroupsMale = [
    "5-14 years",
    "15-24 years",
    "25-34 years",
    "35-54 years",
    "55-74 years",
    "75+ years",
  ];
  ageGroupsFemale = [
    "5-14 years",
    "15-24 years",
    "25-34 years",
    "35-54 years",
    "55-74 years",
    "75+ years",
  ];
  updateLineChart(globalDataSuicide);
  updateCustomBubbleChart(globalDataSuicide, globalDataForestIncomeInflation);
  updateChoroplethChart(globalDataSuicide);
  updatePyramidChart(globalDataSuicide);
}

function calcTooltipData() {
  tooltipSuicideData = calcSuicideRatioForCountries(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
      .filter((item) => highlightedItems.includes(item.country))
  );

  tooltipForestIncomeInflationData = calcForestNNIInflationRatio(
    globalDataForestIncomeInflation.filter((item) =>
      yearsArray.includes(item.year)
    )
  );
}
