const widthLineChart = 1200 - margin.left - margin.right;
const heightLineChart = 175 - margin.top - margin.bottom;

function createLineChart(data1, data2) {
  var lineChartData = extractData(data1, data2, "lineChart");
  const svg = d3
    .select("#lineChart")
    .append("svg")
    .attr("width", widthLineChart + margin.left + margin.right)
    .attr("height", heightLineChart + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .on("mouseup", handleMouseLineChartUp)
    .on("mousedown", handleMouseLineChartDown);

  const xScale = d3
    .scaleBand()
    .domain(lineChartData.map((d) => d[0]))
    .range([widthLineChart, 0])
    .padding(1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(lineChartData, (d) => d[1]) + 0.05])
    .range([heightLineChart, 0]);

  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  svg
    .append("path")
    .datum(lineChartData)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  svg
    .selectAll(".circle")
    .data(lineChartData)
    .enter()
    .append("circle")
    .attr("class", "circle data")
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]))
    .attr("r", 5)
    .attr("fill", "steelblue")
    // .attr("stroke", "black")
    .on("click", handleClickCircle)
    .attr("cursor", "pointer")
    .append("title")
    .text((d) => d[1]);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${heightLineChart})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0));

  svg
    .selectAll(".x-axis text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em");

  svg.append("g").attr("class", "y-axis").call(
    d3
      .axisLeft(yScale)
      // .tickFormat((d) => d3.format(".1f")(d / 1000000) + "M")
      .tickSizeOuter(0)
      .ticks(5)
  );

  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", widthLineChart / 2)
    .attr("y", heightLineChart + margin.top + 30)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-family", "Arial")
    .attr("transform", "translate(-48, -12)")
    .style("font-weight", "550")
    .text("Year");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -heightLineChart / 2)
    .attr("y", -margin.left + 30)
    .style("text-anchor", "middle")
    .style("font-family", "Arial")
    .attr("transform", "rotate(-90) translate(-15, 0)")
    .style("font-size", "16px")
    .style("font-weight", "550")
    // .attr("transform", "translate(5, 5)")
    .text("Suicide Ratio \u2030");

  svg.attr("class", "y-axis text").attr("font-size", "20px");
}
