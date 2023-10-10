function onClickChoropleth(event) {
  if (highlightedItems.includes(event.target.__data__.properties.name)) {
    const index = highlightedItems.indexOf(
      event.target.__data__.properties.name
    );
    highlightedItems.splice(index, 1);
  } else {
    if (availableCountries.includes(event.target.__data__.properties.name)) {
      highlightedItems.push(event.target.__data__.properties.name);
    }
  }
}
