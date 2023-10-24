function extractData(data1, data2, chartType) {
  switch (chartType) {
    case "lineChart":
      return extractLineChart(data1);
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

function extractLineChart(data1) {
  // 1. Year x-axis
  // 2. Average Suicide ratio for chosen data y-axis
  const yearData = [];
  data1.forEach((item) => {
    if (!yearData[item.year]) {
      yearData[item.year] = { population: 0, suicides_no: 0 };
    }
    yearData[item.year] = {
      population:
        Number(yearData[item.year].population) + Number(item.population),
      suicides_no:
        Number(yearData[item.year].suicides_no) + Number(item.suicides_no),
    };
  });

  const finalData = [];
  Object.entries(yearData).forEach((item) => {
    finalData.push([
      Number(item[0]),
      (Number(item[1].suicides_no) / Number(item[1].population)) * 1000,
    ]);
  });
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

function calcSuicideRatioForCountries(data1) {
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

function calcForestNNIInflationRatio(data2) {
  const countries = data2.reduce((countriesX, object) => {
    const key = object.country;
    if (!countriesX[key]) {
      countriesX[key] = [];
    }
    countriesX[key].push(object);
    return countriesX;
  }, {});
  const countriesData = [];
  for (const key in countries) {
    if (countries.hasOwnProperty(key)) {
      if (!countriesData[key]) {
        countriesData[key] = { forest_area: 0, inflation: 0, adjusted_nni: 0 };
      }
      countries[key].forEach((country) => {
        countriesData[key] = {
          forest_area:
            countriesData[key].forest_area + Number(country.forest_area),
          inflation: countriesData[key].inflation + Number(country.inflation),
          adjusted_nni:
            countriesData[key].adjusted_nni + Number(country.adjusted_nni),
        };
      });

      countriesData[key] = {
        forest_area: Number(
          Number(
            countriesData[key].forest_area / countries[key].length
          ).toPrecision(4)
        ),
        inflation: Number(
          Number(
            countriesData[key].inflation / countries[key].length
          ).toPrecision(4)
        ),
        adjusted_nni: Number(
          Number(
            countriesData[key].adjusted_nni / countries[key].length
          ).toPrecision(4)
        ),
      };
    }
  }
  return countriesData;
}

function filterSuicideData() {
  var newData = globalDataSuicide.filter((item) =>
    highlightedItems.includes(item.country)
  );
  newData = newData.filter((item) => yearsArray.includes(item.year));
  return newData;
}

function filterGlobalDataForestIncomeInflation() {
  var newData = globalDataForestIncomeInflation.filter((item) =>
    highlightedItems.includes(item.country)
  );
  newData = newData.filter((item) => yearsArray.includes(item.year));
  return newData;
}

function mergeTwoRatios(data1, data2) {
  for (const key in data1) {
    data2[key] = {
      inflation: data2[key].inflation,
      forest_area: data2[key].forest_area,
      adjusted_nni: data2[key].adjusted_nni,
      suicide_ratio: data1[key],
    };
  }
  return data2;
}


function calcSuicideRatioForAgeAndSex(data1) {
  // Group by sex
  const sexes = data1.reduce((sexes, object) => {
    const key = object.sex;
    if (!sexes[key]) {
      sexes[key] = [];
    }
    sexes[key].push(object);
    return sexes;
  }, {});
  const sexData = [];
  const output = [];

  for (const sex in sexes) {
    if (sexes.hasOwnProperty(sex)) {
      if (!sexData[sex]) {
        sexData[sex] = {
          "5-14 years": 0,
          "15-24 years": 0,
          "25-34 years": 0,
          "35-54 years": 0,
          "55-74 years": 0,
          "75+ years": 0,
        };
      }

      // Group by age
      const ageGroup = sexes[sex].reduce((age, object) => {
        const key = object.age_group;
        if (!age[key]) {
          age[key] = [];
        }
        age[key].push(object);
        return age;
      }, {});
      
      
      //calculate average suisides_ratio
      for(const age in ageGroup){
        ageGroup[age].forEach((item) =>{
          sexData[sex][age] += Number(item.suicides_ratio);
        })
        sexData[sex][age] = Number(sexData[sex][age] / ageGroup[age].length).toPrecision(4);
      } 

    }
  }

  // reformat data to array

    for(const age in sexData["male"]){
      output.push({"ages": age, "male": sexData["male"][age], "female": sexData["female"][age]})
    }
  

  return output;
}