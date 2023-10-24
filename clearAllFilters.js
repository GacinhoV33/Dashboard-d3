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
