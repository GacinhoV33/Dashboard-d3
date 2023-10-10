// Declare a variable to hold the loaded JSON data.
var globalDataSuicide;
var globalDataForestIncomeInflation;
var filteredGlobalDataSuicide;
var filteredGlobalDataForestIncomeInflation;
var globalDataCountries;
var highlightedItems = [];
var availableCountries; 

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
    console.log(results[1]);
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
        createChoroplethMap(globalDataSuicide, globalDataForestIncomeInflation);
        createPyramidChart(globalDataSuicide, globalDataForestIncomeInflation);
        createCustomBubbleChart(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );
        createLineChart(globalDataSuicide, globalDataForestIncomeInflation);

        //utils
        const suicideData = calcRatioForCountries(
          globalDataSuicide,
          globalDataForestIncomeInflation
        );

        availableCountries = Object.keys(suicideData);
      });
    })
    .catch((error) => {
      // If there's an error while loading the JSON data, log the error.
      console.error("Error loading the JSON file:", error);
    });
}

// // This function updates the visualizations based on the selected data type.
function updateIdioms(yearsRange) {
  // Use a switch statement to check which data type is selected.
  switch (yearsRange) {
    case "first":
      // If "old" is selected, update the visualizations with data before or equal to 2010.
      updateCustomBubbleChart(
        globalDataSuicide.filter(
          (item) => Number(item.year) > 2009 && Number(item.year) < 2016
        ),
        globalDataForestIncomeInflation
      );
      updateChoroplethChart(
        globalDataSuicide.filter(
          (item) => Number(item.year) > 2009 && Number(item.year) < 2016
        ),
        globalDataForestIncomeInflation
      );
      updateLineChart(
        globalDataSuicide.filter(
          (item) => Number(item.year) > 2009 && Number(item.year) < 2016
        ),
        globalDataForestIncomeInflation
      );
      updatePyramidChart(
        globalDataSuicide.filter(
          (item) => Number(item.year) > 2009 && Number(item.year) < 2016
        ),
        globalDataForestIncomeInflation
      );
      break;
    case "one":
      // If "new" is selected, update the visualizations with data after 2010.
      updateCustomBubbleChart(
        globalDataSuicide.filter((item) => Number(item.year) === 2011),
        globalDataForestIncomeInflation
      );
      updateChoroplethChart(
        globalDataSuicide.filter((item) => Number(item.year) === 2011),
        globalDataForestIncomeInflation
      );
      updateLineChart(
        globalDataSuicide.filter((item) => Number(item.year) === 2011),
        globalDataForestIncomeInflation
      );
      updatePyramidChart(
        globalDataSuicide.filter((item) => Number(item.year) === 2011),
        globalDataForestIncomeInflation
      );
      break;
    default:
      // If no specific data type is selected, update the visualizations with all the data.
      updateCustomBubbleChart(
        globalDataSuicide,
        globalDataForestIncomeInflation
      );
      updateChoroplethChart(globalDataSuicide, globalDataForestIncomeInflation);
      updateLineChart(globalDataSuicide, globalDataForestIncomeInflation);
      updatePyramidChart(globalDataSuicide, globalDataForestIncomeInflation);
      break;
  }
}
