const widthChoroplethChart = 900;
const heightChoroplethChart = 400; // #TODO

function createChoroplethMap(data1, data2) {
  var dataSuicide = calcSuicideRatioForCountries(data1, data2);
  const svg = d3
    .select("#ChoroplethChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const mapGroup = svg.append("g");

  const colorScale = d3.scaleQuantize(
    [d3.min(Object.values(dataSuicide)), d3.max(Object.values(dataSuicide))],
    d3.schemeBlues[9]
  );

  const projection = d3
    .geoMercator()
    .fitSize([width, height], globalDataCountries);

  const path = d3.geoPath().projection(projection);

  mapGroup
    .selectAll(".country")
    .data(globalDataCountries.features)
    .enter()
    .append("path")
    .attr("class", "country data")
    .attr("d", path)
    .attr("stroke", "#DDD")
    .on("mouseover", handleMouseOverChoropleth) // Function to handle mouseover event
    .on("mouseout", handleMouseOutChoropleth) // Function to handle mouseout event
    .on("click", (item) => onClickChoropleth(item))
    .append("title");

  // color border of countries
  d3.selectAll(".country.data")
    .filter((item) => highlightedItems.includes(item.properties.name))
    .attr("stroke", "lime");

  Object.entries(dataSuicide).forEach((element) => {
    mapGroup
      .selectAll("path")
      .filter(function (d) {
        return d.properties.name == element[0];
      })
      .attr("fill", colorScale(element[1]));
  });

  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zoomed);

  svg.call(zoom);

  function zoomed(event) {
    mapGroup.attr("transform", event.transform);
  }
  // Create a legend for the choropleth map
  createChoroplethLegend(dataSuicide);
}

function createTooltipChoropleth(d, dataSuicide) {
  if (Object.keys(dataSuicide).includes(d.properties.name)) {
    return (
      d.properties.name +
      `\nSuicide ratio - ${dataSuicide[d.properties.name]}\u2030`
    );
  } else {
    return d.properties.name + " - Data not available";
  }
}

function createChoroplethLegend(dataSuicide) {
  // Create a legend for the choropleth map
  const colorScale = d3.scaleQuantize(
    [d3.min(Object.values(dataSuicide)), d3.max(Object.values(dataSuicide))],
    d3.schemeBlues[9]
  );

  const svgTitle = d3
    .select("#choroplethTitle")
    .selectAll("rect")
    .data(colorScale.range())
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      console.log(i);
      let numb = i * 55;
      numb = numb === 'Nan' ? 0 : numb;
      return "translate(" + numb + ", 0)";
    });

  svgTitle
    .append("rect")
    .attr("width", 50)
    .attr("height", 20)
    .style("fill", function (d) {
      return d;
    });

  let maxVal = d3.max(Object.values(dataSuicide));

  svgTitle
    .append("text")
    .attr("x", 25)
    .attr("y", 35)
    .style("text-anchor", "middle")
    .style("font-size", "9px")
    .text(function (d, i) {
      return `${((maxVal / 9) * i).toPrecision(
        2
      )} - ${((maxVal / 9) * (i + 1)).toPrecision(2)}`;
    });

}
