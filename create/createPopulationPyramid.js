const widthPyramidChart = 800;
const heightPyramidChart = 300; // #TODO

function createPopulationPyramid(data1) {
  var sexAgeData = calcSuicideRatioForAgeAndSex(data1);

  const svg = d3
    .select("#PyramidChart")
    .append("svg")
    .attr("width", widthPyramidChart + margin.left + margin.right + 60)
    .attr("height", heightPyramidChart + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
    .attr("transform", `translate(${margin.left + 40},${margin.top + 5})`);

  const xScaleMale = d3
    .scaleLinear()
    .domain([0, 0.8])
    .range([widthPyramidChart / 2, 0]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${heightPyramidChart})`)
    .call(
      d3
        .axisBottom(xScaleMale)
        .tickSize(0)
        .tickPadding(3)
        .tickFormat(function (d) {
          return d + "\u2030";
        })
    )
    .call(function (d) {
      return d.select(".domain").remove();
    });

  const xScaleFemale = d3
    .scaleLinear()
    .domain([0, 0.8])
    .range([widthPyramidChart / 2, widthPyramidChart]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${heightPyramidChart})`)
    .call(
      d3
        .axisBottom(xScaleFemale)
        .tickSize(0)
        .tickPadding(3)
        .ticks(7, "%")
        .tickFormat(function (d) {
          return d + "\u2030";
        })
    )
    .call(function (d) {
      return d.select(".domain").remove();
    });

    svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", widthPyramidChart / 2)
    .attr("y", heightPyramidChart + margin.top + 8 )
    .style("font-size", "15px")
    .style("text-anchor", "middle")
    .text("Suicides ratio \u2030");


  // --
  const GridLineF = function () {
    return d3.axisBottom().scale(xScaleFemale);
  };
  svg
    .append("g")
    .attr("class", "grid")
    .call(
      GridLineF().tickSize(heightPyramidChart, 0, 0).tickFormat("").ticks(7)
    );

  const GridLineM = function () {
    return d3.axisBottom().scale(xScaleMale);
  };

  svg
    .append("g")
    .attr("class", "grid")
    .call(
      GridLineM().tickSize(heightPyramidChart, 0, 0).tickFormat("").ticks(7)
    );

  // Y scale and Axis
  const yScale = d3
    .scaleBand()
    .domain(sexAgeData.map((d) => d.ages))
    .range([heightPyramidChart, 0])
    .padding(0.25);
  svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).tickPadding(15))
    .call((d) => d.select(".domain").remove());

  // --

  svg
    .selectAll(".maleBar")
    .data(sexAgeData)
    .join("rect")
    .attr("class", "barMale")
    .attr("x", (d) => xScaleMale(d.male))
    .attr("y", (d) => yScale(d.ages))
    .attr("width", (d) => widthPyramidChart / 2 - xScaleMale(d.male))
    .attr("height", yScale.bandwidth())
    .style("fill", "#18375F")
    .style("stroke", "black")
    .style("cursor", "pointer")
    .on("mouseover", handlePyramidMouseOver)
    .on("mouseout", handlePyramidMouseOut)
    .on("click", handleClickMale);

  svg
    .selectAll(".femaleBar")
    .data(sexAgeData)
    .join("rect")
    .attr("class", "barFemale")
    .attr("x", xScaleFemale(0))
    .attr("y", (d) => yScale(d.ages))
    .attr("width", (d) => xScaleFemale(d.female) - xScaleFemale(0))
    .attr("height", yScale.bandwidth())
    .style("fill", "#0072BC")
    .style("stroke", "black")
    .style("cursor", "pointer")
    .on("mouseover", handlePyramidMouseOver)
    .on("mouseout", handlePyramidMouseOut)
    .on("click", handleClickFemale);

  //set legend
  svg
    .append("rect")
    .attr("x", 360 - margin.left * 0.7 + 45)
    .attr("y", -(margin.top / 1.25)+1)
    .attr("width", 13)
    .attr("height", 13)
    .style("fill", "#18375F")
    .style("cursor", "pointer")
    .on("click", handleClickSexMale);
  svg
    .append("text")
    .attr("class", "legend")
    .style("font-size", "12px")
    .attr("x", 360 - margin.left * 0.6 + 55)
    .attr("y", -(margin.top / 3.5)+2)
    .text("Male")
    .style("cursor", "pointer")
    .on("click", handleClickSexMale);
  svg
    .append("rect")
    .attr("x", 425 - margin.left * 0.7 + 45)
    .attr("y", -15)
    .attr("width", 13)
    .attr("height", 13)
    .style("fill", "#0072BC")
    .style("cursor", "pointer")
    .on("click", handleClickSexFemale);
  svg
    .append("text")
    .attr("class", "legend")
    .style("font-size", "12px")
    .attr("x", 425 - margin.left * 0.6 + 55)
    .attr("y", -(margin.top / 5.5))
    .on("click", handleClickSexFemale)
    .style("cursor", "pointer")
    .text("Female");

    svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -heightPyramidChart / 2)
    .attr("y", -90)
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .attr("transform", "rotate(-90)")
    .text("Age Group");
}
