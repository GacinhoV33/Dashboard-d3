var selectedClass = "none";

function handlePyramidMouseOver(event, item) {
  if (event.screenX > 1430) {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barFemale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "red").style("stroke", "white");
    selectedClass = "female";
  } else {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barMale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "red").style("stroke", "white");
    selectedClass = "male";
  }
}

function handlePyramidMouseOut(event, item) {
  if (selectedClass === "male") {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barMale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "#18375F").style("stroke", "black");
  } else if (selectedClass === "female") {
    const svg = d3
      .select("#PyramidChart")
      .selectAll(".barFemale")
      .filter((d) => d.ages === item.ages);
    svg.style("fill", "#0072BC").style("stroke", "black");
  } else {
    console.log("Something when wrong on hovering");
  }
}

function handleClickMale(event, item){
    console.log("click male");
}

function handleClickFemale(event, item){
    console.log("click female");
}