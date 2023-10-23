const widthPyramidChart = 900;
const heightPyramidChart = 300; // #TODO


function createPopulationPyramid(data1, data2) {
    var sexAgeData = calcSuicideRatioForAgeAndSex(data1);

    const svg = d3
    .select("#PyramidChart")
    .append("svg")
    .attr("width", widthPyramidChart + margin.left + margin.right)
    .attr("height", heightPyramidChart + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    console.log(sexAgeData)

    const xScaleMale = d3.scaleLinear()
        .domain([0, 0.40])
        .range([widthPyramidChart/2, 0]);
    svg
        .append("g")
        .attr("transform", `translate(0, ${heightPyramidChart})`)
        .call(d3.axisBottom(xScaleMale).tickSize(0).tickPadding(3).ticks(7, "%"))
        .call(function(d) { return d.select(".domain").remove()});

    const xScaleFemale = d3.scaleLinear()
        .domain([0, 0.40])
        .range([widthPyramidChart/2, widthPyramidChart]);
    svg
        .append("g")
        .attr("transform", `translate(0, ${heightPyramidChart})`)
        .call(d3.axisBottom(xScaleFemale).tickSize(0).tickPadding(3).ticks(7))
        .call(function(d) { return d.select(".domain").remove()});

    xScaleFemale.tickFormat(function(d) {
        return d + "\u2030";
        });

 // --
    const GridLineF = function() { return d3.axisBottom().scale(xScaleFemale)};
    svg
        .append("g")
        .attr("class", "grid")
        .call(GridLineF()
        .tickSize(heightPyramidChart, 0, 0)
        .tickFormat("")
        .ticks(7)
    );

    const GridLineM = function() { return d3.axisBottom().scale(xScaleMale)};

    svg
        .append("g")
        .attr("class", "grid")
        .call(GridLineM()
        .tickSize(heightPyramidChart,0,0)
        .tickFormat("")
        .ticks(7)
    );

    // Y scale and Axis
    const yScale = d3.scaleBand()
        .domain(sexAgeData.map(d => d.ages))
        .range([heightPyramidChart, 0])
        .padding(.25);
    svg
        .append("g")
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(15))
        .call(d => d.select(".domain").remove());

//--
    // const mouseover = function(d) {
    //     tooltip
    //     .style("opacity", 1)
    //     d3.select(this)
    //     .style("stroke", "#EF4A60")
    //     .style("opacity", .5)
    // };
    // const mousemove1 = function(event,d) {

    //     tooltip
    //     .html( `${d.male*100}%`)
    //     .style("top", event.pageY - 10 + "px")
    //     .style("left", event.pageX + 10 + "px");
    // };
    // const mousemove2 = function(event,d) {
    // tooltip
    // .html( `${d.female*100}%`)
    //     .style("top", event.pageY - 10 + "px")
    //     .style("left", event.pageX + 10 + "px")
    // };
    // const mouseleave = function(d) {
    //     tooltip
    //     .style("opacity", 0)
    //     d3.select(this)
    //     .style("stroke", "none")
    //     .style("opacity", 1)
    // };

// --
svg
    .selectAll(".maleBar")
      .data(sexAgeData)
    .join("rect")
      .attr("class", "barMale")
      .attr("x", d => xScaleMale(d.male))
      .attr("y", d => yScale(d.ages))
      .attr("width", d => widthPyramidChart/2 - xScaleMale(d.male))
      .attr("height", yScale.bandwidth())
      .style("fill", "#18375F")
    // .on("mouseover", mouseover)
    // .on("mousemove", mousemove1)
    // .on("mouseleave", mouseleave)

    svg
      .selectAll(".femaleBar")
        .data(sexAgeData)
      .join("rect")
        .attr("class", "barFemale")
        .attr("x", xScaleFemale(0))
        .attr("y", d => yScale(d.ages))
        .attr("width", d => xScaleFemale(d.female) - xScaleFemale(0))
        .attr("height", yScale.bandwidth())
        .style("fill", "#0072BC")
    //   .on("mouseover", mouseover)
    //   .on("mousemove", mousemove2)
    //   .on("mouseleave", mouseleave)

    // set title


//set legend
svg
    .append("rect")
        .attr("x", -(margin.left)*0.7)
        .attr("y", -(margin.top/3))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#18375F")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left)*0.6+15)
        .attr("y", -(margin.top/5.5))
    .text("Male")
svg
    .append("rect")
        .attr("x", 40)
        .attr("y", -(margin.top/3))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#0072BC")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 60)
        .attr("y", -(margin.top/5.5))
    .text("Female")
}