var widthCustom = 1000;
var heightCustom = 350;

function createCustomBubbleChart(data1, data2) {
  // Filter the data to remove entries with missing incomeperperson or alcconsumption values
  var currentData = calcForestNNIInflationRatio(
    data1,
    data2.filter((d) => d.year == 2009)
  );
  var suicideData = calcSuicideRatioForCountries(data1, data2);
  var suicideExtractedData = Object.entries(suicideData);
  var forestExtractedData = Object.entries(currentData);
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
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].inflation),
      d3.max(mergedDataExtracted, (d) => d[1].inflation),
    ])
    .range([0, widthCustom]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].suicide_ratio),
      d3.max(mergedDataExtracted, (d) => d[1].suicide_ratio),
    ])
    .range([heightCustom, 0]);

  const rScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].adjusted_nni),
      d3.max(mergedDataExtracted, (d) => d[1].adjusted_nni),
    ])
    .range([3, 15]);

  const colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(mergedDataExtracted, (d) => d[1].forest_area),
      d3.max(mergedDataExtracted, (d) => d[1].forest_area),
    ])
    .range([0, 1]);

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
  // .append("title");
  // .text((d) => d.country + tooltipSupport(d.country, currentData));

  //highlighted items
  svg
    .selectAll(".circle")
    .filter((d) => highlightedItems.includes(d[0]))
    .attr("stroke", "lime");

  // Create tick marks and labels for the x and y axes
  var xTicks = [];
  var yTicks = [0];

  let minVal = Math.round(d3.min(mergedDataExtracted, (d) => d[1].inflation));
  let maxVal = Math.round(d3.max(mergedDataExtracted, (d) => d[1].inflation));
  let range = Math.abs(maxVal - minVal);
  for (let index = minVal; index <= range; index += 1) {
    xTicks.push(index);
  }

  let yMinVal = d3.min(mergedDataExtracted, (d) => d[1].suicide_ratio);
  let yMaxVal = d3.max(mergedDataExtracted, (d) => d[1].suicide_ratio);
  for (let index = 0; index <= 8; index += 1) {
    yTicks.push((index * (Math.abs(yMaxVal - yMinVal) / 8)).toPrecision(2));
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
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Inflation");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -heightCustom / 2)
    .attr("y", -margin.left + 30)
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("transform", "rotate(-90)")
    .text("Suicide ratio");
}
