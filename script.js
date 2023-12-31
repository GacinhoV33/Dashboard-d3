var globalDataSuicide;
var globalDataForestIncomeInflation;
var filteredYearGlobalDataSuicide;
var filteredGlobalDataForestIncomeInflation;
var globalDataCountries;
var highlightedItems = [];
var availableCountries;
var filteredYearDataSuicide;
var filteredYearForestIncomeNNIData;
var mergedDataExtractedBase;
var tooltipSuicideData;
var tooltipForestIncomeInflationData;

var ageGroupsMale = [
  "5-14 years",
  "15-24 years",
  "25-34 years",
  "35-54 years",
  "55-74 years",
  "75+ years",
];
var ageGroupsFemale = [
  "5-14 years",
  "15-24 years",
  "25-34 years",
  "35-54 years",
  "55-74 years",
  "75+ years",
];
var yearsArray = [
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
];
// Define margins for the visualizations.
const margin = { top: 20, right: 20, bottom: 50, left: 80 };

// Calculate the width and height of the visualizations based on the margins.
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

function importFiles(file1, file2) {
  return Promise.all([d3.json(file1), d3.csv(file2)]);
}

// This function initiates the dashboard and loads the JSON data.
function startDashboard() {
  // Load the JSON data using D3.js.
  const file3 = "./data/forest_area_adjusted_nni_inflation_ready_df.csv";
  const file2 = "./data/suicides_ready_df.csv";
  const file1 = "./data/data_countries.json";
  importFiles(file1, file2).then(function (results) {
    // Store the JSON data into globalDataCountries using topojson.feature
    globalDataCountries = topojson.feature(
      results[0],
      results[0].objects.countries
    );
  });

  d3.csv("suicides_ready_df.csv")
    .then((data) => {
      // Once the data is loaded successfully, store it in the globalData variable.
      globalDataSuicide = data;
    })
    .then(() => {
      d3.csv(file3).then((data) => {
        globalDataForestIncomeInflation = data;
        tooltipSuicideData = calcSuicideRatioForCountries(globalDataSuicide);

        tooltipForestIncomeInflationData = calcForestNNIInflationRatio(
          globalDataForestIncomeInflation
        );

        availableCountries = Object.keys(tooltipSuicideData);
        highlightedItems = JSON.parse(JSON.stringify(availableCountries)); //deep copy
        createChoroplethMap(globalDataSuicide, globalDataForestIncomeInflation);
        createCustomBubbleChart(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );
        createLineChart(globalDataSuicide, globalDataForestIncomeInflation);
        createPopulationPyramid(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );
      });
    })
    .catch((error) => {
      // If there's an error while loading the JSON data, log the error.
      console.error("Error loading the JSON file:", error);
    });
}

// // This function updates the visualizations based on the selected data type.

// function filterYears(year) {
//   if (year === "all") {
//     yearsArray = [
//       "2006",
//       "2007",
//       "2008",
//       "2009",
//       "2010",
//       "2011",
//       "2012",
//       "2013",
//       "2014",
//       "2015",
//       "2016",
//     ];
//     yearsArray.forEach((year) => {
//       document.getElementById(`button-${year}`).style.border = "1px red solid";
//     });
//   } else {
//     if (yearsArray.includes(year)) {
//       yearsArray = yearsArray.filter((item) => item !== year);
//       document.getElementById(`button-${year}`).style.border = "1px solid #ccc";
//     } else {
//       yearsArray.push(year);
//       document.getElementById(`button-${year}`).style.border = "1px red solid";
//     }
//   }

//   const filteredDataSuicide = globalDataSuicide.filter((item) =>
//     yearsArray.includes(item.year)
//   );

//   const filteredDataForestIncomeInflation =
//     globalDataForestIncomeInflation.filter((d) => yearsArray.includes(d.year));

//   updateLineChart(
//     globalDataSuicide.filter((item) => highlightedItems.includes(item.country))
//   );

//   updateChoroplethChart(filteredDataSuicide, filteredDataForestIncomeInflation);

//   updateCustomBubbleChart(
//     filteredDataSuicide,
//     filteredDataForestIncomeInflation
//   );
// }
