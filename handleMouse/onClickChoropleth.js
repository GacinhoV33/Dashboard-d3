function onClickChoropleth(event) {
  console.log(highlightedItems.length);
  if(highlightedItems.length === 71){
    highlightedItems = [event.target.__data__.properties.name];
  }
  else if (highlightedItems.includes(event.target.__data__.properties.name)) {
    const index = highlightedItems.indexOf(
      event.target.__data__.properties.name
    );
    highlightedItems.splice(index, 1);
  } else {
    if (availableCountries.includes(event.target.__data__.properties.name)) {
      highlightedItems.push(event.target.__data__.properties.name);
    }
  }
  // updating line-chart based on highlighted items
  updateLineChart(filterSuicideData()); 
  updateCustomBubbleChart(filterSuicideData(), filterGlobalDataForestIncomeInflation());
}
