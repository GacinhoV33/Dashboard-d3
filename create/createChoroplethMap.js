const widthChoroplethChart = 900;
const heightChoroplethChart = 280; // #TODO

function createChoroplethMap(data1) {
  var dataSuicide = calcSuicideRatioForCountries(data1);
  const svg = d3
    .select("#ChoroplethChart")
    .append("svg")
    .attr("width", widthChoroplethChart)
    .attr("height", heightChoroplethChart);

  const mapGroup = svg.append("g");

  const colorScale = d3.scaleQuantize([0, 0.34], d3.schemeBlues[9]);

  const projection = d3
    .geoMercator()
    .fitSize(
      [widthChoroplethChart, heightChoroplethChart],
      globalDataCountries
    );
  const path = d3.geoPath().projection(projection);

  mapGroup
    .selectAll(".country")
    .data(globalDataCountries.features)
    .enter()
    .append("path")
    .attr("class", "country data")
    .attr("d", path)
    .attr("stroke", "#888")
    .on("mouseover", handleMouseOverChoropleth) // Function to handle mouseover event
    .on("mouseout", handleMouseOutChoropleth) // Function to handle mouseout event
    .on("click", (item) => onClickChoropleth(item))
    .append("title");

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
      [widthChoroplethChart, heightChoroplethChart],
    ])
    .on("zoom", zoomed);

  svg.call(zoom);

  function zoomed(event) {
    mapGroup.attr("transform", event.transform);
  }
  // Create a legend for the choropleth map
  createChoroplethLegend();
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

function createChoroplethLegend() {
  // Create a legend for the choropleth map
  const colorScale = d3.scaleQuantize([0, 0.34], d3.schemeBlues[9]);

  d3.select("#scaleChoroplethCustom").attr("transform", "translate(0, 5)");
  // d3.select("#ChoroplethChart").attr("transform", "translate(0, 10)")

  const svgTitle = d3
    .select("#choroplethTitle")
    .selectAll("rect")
    .data(colorScale.range())
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      let numb = i * 77 + 2;
      numb = numb === "Nan" ? 0 : numb;
      return "translate(" + numb + ", 10)";
    });

  svgTitle
    .append("rect")
    .attr("width", 76)
    .attr("height", 20)
    .style("fill", function (d) {
      return d;
    });

  svgTitle
    .append("text")
    .attr("x", 40)
    .attr("y", 35)
    .style("text-anchor", "middle")
    .style("font-size", "9px")
    .text(function (d, i) {
      return `${((0.34 / 9) * i).toPrecision(
        2
      )} - ${((0.34 / 9) * (i + 1)).toPrecision(2)}`;
    });

  d3.select("#choroplethTitle")
    .append("text")
    .attr("x", widthChoroplethChart / 3 + 50)
    .attr("y", 1)
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Suicides ratio \u2030")
    .attr("transform", `translate(0, 5)`);
}
