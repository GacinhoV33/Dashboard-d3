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

  const colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(Object.values(dataSuicide)),
      d3.max(Object.values(dataSuicide)),
    ])
    .range([0, 1]);

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
      .attr("fill", d3.interpolateBlues(colorScale(element[1])));
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
  const svgTitle = d3
    .select("#choroplethTitle")
    .append("svg")
    .attr("width", width)
    .attr("height", height / 3);

  const defs = svgTitle.append("defs");
  const gradient = defs
    .append("linearGradient")
    .attr("id", "colorScaleGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d3.interpolateBlues(0));
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d3.interpolateBlues(1));
  // Create the legend rectangle filled with the color scale gradient
  const legend = svgTitle.append("g").attr("transform", `translate(0, 40)`);
  const legendHeight = 50;
  const legendWidth = width - 50;
  legend
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#colorScaleGradient)");

  // Add tick marks and labels to the legend
  for (let index = 0; index < 5; index += 1) {
    legend
      .append("text")
      .attr("x", (legendWidth * index) / 4 - (index % 5) * 7)
      .attr("y", legendHeight + 20)
      .text(((d3.max(Object.values(dataSuicide)) / 4) * index).toPrecision(4));
  }
}
