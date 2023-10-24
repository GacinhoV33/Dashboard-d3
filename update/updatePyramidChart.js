function updatePyramidChart(data1) {
  var sexAgeData = calcSuicideRatioForAgeAndSex(data1);
  const svg = d3.select("#PyramidChart").select("svg");
  svg.transition().duration(500);

  const xScaleMale = d3
    .scaleLinear()
    .domain([0, 0.8])
    .range([widthPyramidChart / 2, 0]);
  const xScaleFemale = d3
    .scaleLinear()
    .domain([0, 0.8])
    .range([widthPyramidChart / 2, widthPyramidChart]);

  svg
    .selectAll(".barMale")
    .data(sexAgeData)
    .transition()
    .duration(500)
    .attr("x", (d) => xScaleMale(d.male))
    .attr("width", (d) => widthPyramidChart / 2 - xScaleMale(d.male))
    .style("opacity", (d) => ageGroupsMale.includes(d.ages) ? 1 : 0.15)
    ;
  svg
    .selectAll(".barFemale")
    .data(sexAgeData)
    .transition()
    .duration(500)
    .attr("x", xScaleFemale(0))
    .style("opacity", (d) => ageGroupsFemale.includes(d.ages) ? 1 : 0.15)
    .attr("width", (d) => xScaleFemale(d.female) - xScaleFemale(0));
}
