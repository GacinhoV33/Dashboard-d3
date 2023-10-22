var widthCustom = 1500;
var heightCustom = 290;

function createCustomBubbleChart(data1, data2) {
  // Filter the data to remove entries with missing incomeperperson or alcconsumption values
  var currentData = calcForestNNIInflationRatio(data2);
  var suicideData = calcSuicideRatioForCountries(data1);
  var mergedData = mergeTwoRatios(suicideData, currentData);
  var mergedDataExtracted = Object.entries(mergedData);

  // Create an SVG element to hold the scatter plot
  const svg = d3
    .select("#customChart")
    .append("svg")
    .attr("width", widthCustom + margin.left + margin.right)
    .attr("height", heightCustom + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x and y scales for the scatter plot
  const xScale = d3.scaleLinear().domain([-5, 19]).range([0, widthCustom]);

  const yScale = d3.scaleLinear().domain([0, 0.45]).range([heightCustom, 0]);

  const rScale = d3.scaleLinear().domain([925.5, 4032000]).range([8, 20]);

  const colorScale = d3.scaleLinear().domain([0, 97.98]).range([0, 1]);

  // Add circles to the scatter plot representing each country
  svg
    .selectAll(".circle")
    .data(mergedDataExtracted)
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d[1].inflation))
    .attr("cy", (d) => yScale(d[1].suicide_ratio))
    .attr("r", (d) => rScale(d[1].adjusted_nni))
    .attr("data-original-fill", "steelblue")
    .attr("stroke", "black")
    .attr("fill", (d) =>
      d3.interpolateGreens(Number(colorScale(d[1].forest_area)))
    )
    .on("mouseover", handleMouseOverCustom) // Function to handle mouseover event
    .on("mouseout", handleMouseOutCustom) // Function to handle mouseout event
    .on("click", onClickBubble);

  // Create tick marks and labels for the x and y axes
  var xTicks = [];
  var yTicks = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45];

  let minVal = -7;
  let maxVal = 32;
  let range = Math.abs(maxVal - minVal);
  for (let index = minVal; index <= range; index += 1) {
    xTicks.push(index);
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
    )
    .attr("transform", `translate(${xScale(0)}, 0)`);

  // Add labels for the x and y axes
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", widthCustom / 2)
    .attr("y", heightCustom + margin.top + 20)
    .style("font-size", "18px")
    .style("text-anchor", "middle")
    .text("Inflation %");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -heightCustom / 2)
    .attr("y", -margin.left + 30)
    .style("text-anchor", "middle")
    .style("font-size", "18px")
    .attr("transform", "rotate(-90)")
    .text("Suicide ratio \u2030");
}
