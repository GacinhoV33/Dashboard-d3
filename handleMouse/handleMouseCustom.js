function handleMouseOverCustom(event, item) {
  d3.selectAll(".circle")
    .style("cursor", "pointer")
    .filter((d) => item[0] === d[0])
    .attr("stroke", "red");
}

function handleMouseOutCustom(event, item) {
  d3.selectAll(".circle")
    .attr("stroke", (d) => highlightedItems.includes(d[0]) ? "lime" : "black");
}

function onClickBubble(event, item) {
  if (highlightedItems.includes(item[0])) {
    const index = highlightedItems.indexOf(
      item[0]
    );
    highlightedItems.splice(index, 1);
  } else {
    if (availableCountries.includes(item[0])) {
      highlightedItems.push(item[0]);
    }
  }
}
