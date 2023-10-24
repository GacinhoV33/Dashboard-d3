var widthCustom = 1500;
var heightCustom = 235;

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

  const yScale = d3.scaleLinear().domain([0, 0.6]).range([heightCustom, 0]);

  const rScale = d3.scaleLinear().domain([925.5, 4032000]).range([2, 18]);

  const colorScale = d3.scaleQuantize([0, 100], d3.schemeGreens[9]);
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
    .attr("fill", (d) => colorScale(d[1].forest_area))
    .on("mouseover", handleMouseOverCustom) // Function to handle mouseover event
    .on("mouseout", handleMouseOutCustom) // Function to handle mouseout event
    .on("click", onClickBubble);

  // Create tick marks and labels for the x and y axes
  var xTicks = [];
  var yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];

  let minVal = -5;
  let maxVal = 19;
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
    .style("font-family", "Arial")
    .style("font-weight", "550")
    .text("Inflation %");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -heightCustom / 2)
    .attr("y", -margin.left + 60)
    .style("text-anchor", "middle")
    .style("font-family", "Arial")
    .style("font-weight", "550")
    .style("font-size", "18px")
    .attr("transform", "rotate(-90)")
    .text("Suicide ratio \u2030");

  createForestScale();
  createCircleScale();
}

function createForestScale() {
  const colorScale = d3.scaleQuantize([0, 100], d3.schemeGreens[9]);

  const svgTitle = d3
    .select("#customChartTitle")
    .selectAll("rect")
    .data(colorScale.range())
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      let numb = i * 77 + 2;
      numb = numb === "Nan" ? 0 : numb;
      return "translate(" + numb + ", -5)";
    });

  d3.select("#customChartTitle")
    .append("text")
    .style("font-size", "11px")
    .attr("x", 2)
    .attr("y", 7.5)
    .style("font-family", "Arial")
    .text("Forest area");

  const svgContainer = d3
    .select("#scaleBubbleChart")
    .attr("transform", "translate(490, 10)");

  svgTitle
    .append("rect")
    .attr("width", 76)
    .attr("height", 20)
    .attr("transform", "translate(60, 0)")
    .style("fill", function (d) {
      return d;
    });

  svgTitle
    .append("text")
    .attr("x", 40)
    .attr("y", 35)
    .style("font-family", "Arial")
    .attr("transform", "translate(60, 0)")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text(function (d, i) {
      return `${((100 / 9) * i).toPrecision(
        2
      )}% - ${(100 / 9) * (i + 1) !== 100 ? ((100 / 9) * (i + 1)).toPrecision(2) : 100}%`;
    });
}

function createCircleScale() {
  const svgTitle = d3
    .select("#customChartCircleTitle")
    .selectAll("circle")
    .data([2, 6, 10, 14, 18])
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      let numb = d * 2 * (i / 10 + 5);
      numb = numb === "Nan" ? 0 : numb;
      return "translate(" + numb + ", 20)";
    });

  svgTitle
    .append("circle")
    .attr("r", (d) => d)
    .style("fill", function (d) {
      return d;
    });

  const textScale = ["1k", "1M", "2M", "3M", "4M"];
  svgTitle
    .append("text")
    .attr("x", 0)
    .attr("y", 30)
    .style("font-family", "Arial")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text(function (d, i) {
      return textScale[i];
    });
  const svgContainer = d3
    .select("#scaleCircleBubbleChart")
    .attr("transform", "translate(1600, -295)");

  svgContainer
    .append("text")
    .attr("x", 80)
    .attr("y", 13)
    .style("font-family", "Arial")
    .style("font-size", "11px")
    .text("Adjusted NNI $");
}
