var widthCustom = 800;
var heightCustom = 600;

function createCustomBubbleChart(data1, data2) {
  // Filter the data to remove entries with missing incomeperperson or alcconsumption values
  var currentData = calcForestNNIInflationRatio(data1, data2);
  var suicideData = calcSuicideRatioForCountries(data1, data2);
  var suicideExtractedData = Object.entries(suicideData);
  var forestExtractedData = Object.entries(currentData);
  var mergedData = mergeTwoRatios(suicideData, currentData);
  var mergedDataExtracted = Object.entries(mergedData);
  console.log("IM THERE", mergedData);
  // Create an SVG element to hold the scatter plot
  const svg = d3
    .select("#customChart")
    .append("svg")
    .attr("width", widthCustom + margin.left + margin.right)
    .attr("height", heightCustom + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x and y scales for the scatter plot
  const xScale = d3
    .scaleLog()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].inflation),
      d3.max(mergedDataExtracted, (d) => d[1].inflation),
    ])
    .range([0, widthCustom]);
  // console.log(forestExtractedData);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].suicide_ratio),
      d3.max(mergedDataExtracted, (d) => d[1].suicide_ratio),
    ])
    .range([height, 0]);

  // Add circles to the scatter plot representing each country
  svg
    .selectAll(".circle")
    .data(mergedDataExtracted)
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d[1].inflation))
    .attr("cy", (d) => yScale(d[1].suicide_ratio))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .attr("data-original-fill", "steelblue")
    .attr("stroke", "black")
    // .on("mouseover", handleMouseOver) // Function to handle mouseover event
    // .on("mouseout", handleMouseOut) // Function to handle mouseout event
    // .on("click", handleClick)
    .append("title")
    // .text((d) => d.country + tooltipSupport(d.country, currentData));

  // Create tick marks and labels for the x and y axes
  var xTicks = [];
  var yTicks = [];
  for (let index = 0; index <= 1; index += 0.25) {
    xTicks.push(Math.round(xScale.invert(index * widthCustom)));
    yTicks.push(Math.round(yScale.invert(index * heightCustom)));
  }

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${heightCustom})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickFormat((d) => d)
        .tickValues(xTicks)
        .tickSizeOuter(0)
    );

  svg
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => d)
        .tickValues(yTicks)
        .tickSizeOuter(0)
    );

  // Add labels for the x and y axes
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", widthCustom / 2)
    .attr("y", heightCustom + margin.top + 20)
    .style("text-anchor", "middle")
    .text("Income per person");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -heightCustom / 2)
    .attr("y", -margin.left + 30)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Alcohol Consumption");
}
