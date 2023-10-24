var startClickPosition = 0;
var endClickPosition = 0;

function handleMouseLineChartUp(event, item) {
  if (event.x > 450 && event.x < 1450 && event.y > 160 && event.y < 220) {
    endClickPosition = event.x;
    changeHighlightedYears();
  }
}

function handleMouseLineChartDown(event, item) {
  if (event.x > 450 && event.x < 1450 && event.y > 160 && event.y < 220) {
    startClickPosition = event.x;
  }
}

function changeHighlightedYears() {
  var start = Math.round((startClickPosition - 450) / 91);
  var end = Math.round((endClickPosition - 450) / 91);
  yearsArray = [];

  for (var i = start; i <= end; i++) {
    yearsArray.push(`${2005 + i}`);
  }
  updateChartsLine();
}

function handleClickCircle(event, item) {
  console.log(item);
  if (yearsArray.includes(String(item[0]))) {
    const index = yearsArray.indexOf(String(item[0]));
    yearsArray.splice(index, 1);
  } else {
    yearsArray.push(String(item[0]));
  }
  updateChartsLine();
}

function updateChartsLine() {
  updateLineChart(
    globalDataSuicide
      .filter((item) => highlightedItems.includes(item.country))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );
  updateChoroplethChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      )
  );
  updateCustomBubbleChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter(
        (d) =>
          (ageGroupsMale.includes(d.age_group) && d.sex === "male") ||
          (ageGroupsFemale.includes(d.age_group) && d.sex === "female")
      ),
    globalDataForestIncomeInflation.filter((item) =>
      yearsArray.includes(item.year)
    )
  );
  updatePyramidChart(
    globalDataSuicide
      .filter((item) => yearsArray.includes(item.year))
      .filter((item) => highlightedItems.includes(item.country))
  );
}
