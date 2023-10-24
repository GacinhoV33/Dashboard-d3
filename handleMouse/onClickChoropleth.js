function onClickChoropleth(event) {
  if (highlightedItems.length === 71) {
    highlightedItems = [event.target.__data__.properties.name];
  } else if (highlightedItems.includes(event.target.__data__.properties.name)) {
    const index = highlightedItems.indexOf(
      event.target.__data__.properties.name
    );
    highlightedItems.splice(index, 1);
    if (highlightedItems.length === 0) {
      highlightedItems = availableCountries;
    }
  } else {
    if (availableCountries.includes(event.target.__data__.properties.name)) {
      highlightedItems.push(event.target.__data__.properties.name);
    }
  }
  // updating line-chart based on highlighted items
  // filter by country
  updateLineChart(
    globalDataSuicide
      .filter((item) => highlightedItems.includes(item.country))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );
  // filter by year only
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
  updateChoroplethChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );

  updatePyramidChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter((item) => highlightedItems.includes(item.country))
  );

  calcTooltipData();
}
