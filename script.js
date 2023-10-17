// Declare a variable to hold the loaded JSON data.
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

  const file2 = "suicides_ready_df.csv";
  const file1 = "data_countries.json";

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
      d3.csv("forest_area_adjusted_nni_inflation_ready_df.csv").then((data) => {
        globalDataForestIncomeInflation = data;
        const suicideData = calcSuicideRatioForCountries(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );
        const forestData = calcForestNNIInflationRatio(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );
        filteredYearDataSuicide = suicideData;
        filteredYearForestIncomeNNIData = forestData;

        // for custom bubble scale reason
        
        var mergedData = mergeTwoRatios(suicideData, forestData);
        mergedDataExtractedBase = Object.entries(mergedData);

        availableCountries = Object.keys(suicideData);
        highlightedItems = JSON.parse(JSON.stringify(availableCountries)); //deep copy
        createChoroplethMap(globalDataSuicide, globalDataForestIncomeInflation);
        // createPyramidChart(globalDataSuicide, globalDataForestIncomeInflation);
        createCustomBubbleChart(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );
        createLineChart(globalDataSuicide, globalDataForestIncomeInflation);
      });
    })
    .catch((error) => {
      // If there's an error while loading the JSON data, log the error.
      console.error("Error loading the JSON file:", error);
    });
}

// // This function updates the visualizations based on the selected data type.

function filterYears(year) {
  if (year === "all") {
    yearsArray = [
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
    yearsArray.forEach((year) => {
      document.getElementById(`button-${year}`).style.border = "1px red solid";
    });
  } else {
    if (yearsArray.includes(year)) {
      yearsArray = yearsArray.filter((item) => item !== year);
      document.getElementById(`button-${year}`).style.border = "1px solid #ccc";
    } else {
      yearsArray.push(year);
      document.getElementById(`button-${year}`).style.border = "1px red solid";
    }
  }

  const filteredDataSuicide = globalDataSuicide
    .filter((item) => yearsArray.includes(item.year))
    .filter((d) => highlightedItems.includes(d.country));

  const filteredDataForestIncomeInflation = globalDataForestIncomeInflation
    .filter((d) => yearsArray.includes(d.year))
    .filter((d) => highlightedItems.includes(d.country));

  updateLineChart(filteredDataSuicide);

  updateChoroplethChart(filteredDataSuicide, filteredDataForestIncomeInflation);

  updateCustomBubbleChart(
    filteredDataSuicide,
    filteredDataForestIncomeInflation
  );
}
