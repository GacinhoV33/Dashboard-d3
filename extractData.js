function extractData(data1, data2, chartType) {
  switch (chartType) {
    case "lineChart":
      return extractLineChart(data1, data2);
    case "customChart":
      return extractCustomChart(data1, data2);
    case "choroplethChart":
      return extractChoroplethChart(data1, data2);
    case "pyramidChart":
      return extractPyramidChart(data1, data2);
    default:
      return mergeTwoDatasets(data1, data2);
  }
}

function extractLineChart(data1, data2) {
  // 1. Year x-axis
  // 2. Average Suicide ratio for chosen data y-axis
  const yearData = [];
  data1.forEach((item) => {
    if (!yearData[item.year]) {
      yearData[item.year] = { population: 0, suicides_no: 0 };
    }
    yearData[item.year] = {
      population: Number(yearData[item.year].population) + Number(item.population),
      suicides_no: Number(yearData[item.year].suicides_no) + Number(item.suicides_no),
    };
  });   
  
  const finalData = [];
  Object.entries(yearData).forEach((item) => {
    finalData.push([Number(item[0]), Number(item[1].suicides_no)/Number(item[1].population)*1000]);
  })
  return finalData.sort((item1, item2) => item2[0] - item1[0]);
}

function extractCustomChart(data1, data2) {
  // each bubble represents one country
  // show only the countries that are in filters
  // dragging mouse over chart highligts countries and include them in filter
  //  1. y-axis suicide ratio
  //  2. x-axis inflation
  //  3. circle radius - income
  //  4. saturation - forest area
  return null; //
}

function extractChoroplethChart(data1, data2) {
  // 1. Countries names
  // Suicide ratio as a saturation

  return null; //
}

function extractPyramidChart(data1, data2) {
  // x-axis suicide ratio with
  // y-axis age group
  // filtering by selected countries

  return null; //
}

function calcSuicideRatioForCountries(data1, data2){
  const countries = data1.reduce((countries, object) => {
    const key = object.country;
    if (!countries[key]) {
      countries[key] = [];
    }
    countries[key].push(object);
    return countries;
  }, {});
  const countriesData = [];
  for (const key in countries) {
    if (countries.hasOwnProperty(key)) {
      if (!countriesData[key]) {
        countriesData[key] = 0;
      }
      countries[key].forEach((country) => {
        countriesData[key] += Number(country.suicides_ratio);
      });
      countriesData[key] = Number(
        Number(countriesData[key] / countries[key].length).toPrecision(4)
      );
    }
  }
  return countriesData;
}

function calcForestRatio(data1, data2){
  const countries = data2.reduce((countries, object) => {
    const key = object.country;
    if (!countries[key]) {
      countries[key] = [];
    }
    countries[key].push(object);
    return countries;
  }, {});
  const countriesData = [];
  for (const key in countries) {
    if (countries.hasOwnProperty(key)) {
      if (!countriesData[key]) {
        countriesData[key] = 0;
      }
      countries[key].forEach((country) => {
        countriesData[key] += Number(country.forest_area);
      });
      countriesData[key] = Number(
        Number(countriesData[key] / countries[key].length).toPrecision(4)
      );
    }
  }
  return countriesData;
}


function filterSuicideData(){
  var newData = globalDataSuicide.filter((item) => highlightedItems.includes(item.country));
  newData = newData.filter((item) => yearsArray.includes(item.year));
  return newData;
}