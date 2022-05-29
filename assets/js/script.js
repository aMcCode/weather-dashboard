let requestedCity;
let weatherURL, forecastURL, oneCallURL /*, positionURL*/;
let iconURL = "http://openweathermap.org/img/w/";
let city, lat, lon;
let fullWeatherFile;
const weatherApiKey = "93ed017e828ae552870f8ee1b69cdc22";
let forcastDiv = $(".forcast-wrapper");

let storedSearches = JSON.parse(localStorage.getItem("storedCities"));
let storedSearchObj = storedSearches ? storedSearches : [];
let searchDiv = $("#search-div");
let prevSearchDiv;

if (storedSearches) {
  searchDiv.append('<div id="prev-search-div" class="container"></div>');
  prevSearchDiv = $("#prev-search-div");
  storedSearches.forEach(createPrevSearchBtns);
}

function createPrevSearchBtns(searchItm) {
  prevSearchDiv.append(
    `<button class="prev-search-btn" type="button">${searchItm}</button>`
  );
}

let isGoodCityRequest = function (requestedCity) {
  if (requestedCity) return true;
  else return false;
};

function setPosition(jsonFile) {
  city = jsonFile.name;
  lat = jsonFile.coord.lat;
  lon = jsonFile.coord.lon;

  oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  getOneFile(oneCallURL);
}

let get_UV_indicator = function (uvVal) {
  const valMap = {
    Low: [0, 2],
    Moderate: [3, 5],
    High: [6, 7],
    VeryHigh: [8, 10],
    Extreme: [11, 99],
  };
  let uvValue = parseFloat(uvVal);
  if (!uvValue && uvValue != 0) return;
  if (uvValue >= valMap.Low[0] && uvValue <= valMap.Low[1]) return "low";
  if (uvValue >= valMap.Moderate[0] && uvValue <= valMap.Moderate[1])
    return "moderate";
  if (uvValue >= valMap.High[0] && uvValue <= valMap.High[1]) return "high";
  if (uvValue >= valMap.VeryHigh[0] && uvValue <= valMap.VeryHigh[1])
    return "veryHigh";
  if (uvValue >= valMap.Extreme[0] && uvValue <= valMap.Extreme[1])
    return "extreme";
};

function packageAndDisplayWeatherData(jsonFile) {
  let curDate = moment(new Date(jsonFile.current.dt * 1000)).format("L");
  let curIconURL = iconURL + jsonFile.current.weather[0].icon + ".png";
  let uvIndicator = get_UV_indicator(jsonFile.current.uvi);
  let text = `<div id="current-forcast-div" class="wide-card">
        <h3>${city} (${curDate})</h3>
        <img src="${curIconURL}" alt="Icon depicting current weather.">
        <p>Temp: ${jsonFile.current.temp} &deg;F</p>
        <p>Wind: ${jsonFile.current.wind_speed} MPH</p>
        <p>Humidity: ${jsonFile.current.humidity} %</p>
        <p>UV Index: <span class="${uvIndicator}">${jsonFile.current.uvi}</span></p>
        </div>`;

  forcastDiv.append(text);

  let wklyData = jsonFile.daily;

  for (var i = 0; i < 5; i++) {
    let wklyDate = moment(new Date(wklyData[i].dt * 1000)).format("L");
    let dailyIconURL = iconURL + wklyData[i].weather[0].icon + ".png";

    if (i === 0)
      forcastDiv.append(
        '<h3 id="5dayH3">5-Day Forcast</h3><div id="daily-forcast-div" class="container"></div>'
      );

    let text = `<div class="daily-card">
        <p>${wklyDate}</p>
        <img src="${dailyIconURL}" alt="Icon depicting daily weather.">
        <p>Temp: ${wklyData[i].temp.max} &deg;F</p>
        <p>Wind: ${wklyData[i].wind_speed} MPH</p>
        <p>Humidity: ${wklyData[i].humidity} %</p>
      </div>`;

    let dlyWeatherDiv = $("#daily-forcast-div");

    dlyWeatherDiv.append(text);
  }
}

function getWeatherFile(URL) {
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      setPosition(myJson);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getOneFile(URL) {
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      packageAndDisplayWeatherData(myJson);
    })
    .catch(function (error) {
      console.log(error);
    });
}

$("#searchBtn").click(function () {
  let curFcastDiv = document.getElementById("current-forcast-div");
  let dailyDiv = document.getElementById("daily-forcast-div");
  let h3 = document.getElementById("5dayH3");

  if (curFcastDiv) document.getElementById("current-forcast-div").remove();
  if (dailyDiv) document.getElementById("daily-forcast-div").remove();
  if (h3) document.getElementById("5dayH3").remove();

  const requestedCityInput = document.querySelector("#searchTxt");
  requestedCity = requestedCityInput.value;
  let isGoodRequest = isGoodCityRequest(requestedCity);
  if (isGoodRequest === true) {
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity}&units=imperial&appid=${weatherApiKey}`;
    getWeatherFile(weatherURL);
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${requestedCity}units=imperial&appid=${weatherApiKey}`;

    if (!storedSearchObj.includes(requestedCity)) {
      storedSearchObj.unshift(requestedCity);

      if (storedSearchObj.length > 3) storedSearchObj.pop();

      localStorage.setItem("storedCities", JSON.stringify(storedSearchObj));
      if (!prevSearchDiv)
        searchDiv.append('<div id="prev-search-div" class="container"></div>');

      prevSearchDiv = $("#prev-search-div");
      prevSearchDiv.prepend(`<p id="${requestedCity}">${requestedCity}</p>`);
      let pCount = $("#prev-search-div p").length;
      if (pCount > 3) prevSearchDiv.children().last().remove();
    }
    requestedCityInput.value = "";
  }
});

prevSearchDiv.click(function (e) {
  if (e.target.classList.contains("prev-search-btn")) {
    let curFcastDiv = document.getElementById("current-forcast-div");
    let dailyDiv = document.getElementById("daily-forcast-div");
    let h3 = document.getElementById("5dayH3");

    if (curFcastDiv) document.getElementById("current-forcast-div").remove();
    if (dailyDiv) document.getElementById("daily-forcast-div").remove();
    if (h3) document.getElementById("5dayH3").remove();

    requestedCity = e.target.innerHTML;
    let isGoodRequest = isGoodCityRequest(requestedCity);
    if (isGoodRequest === true) {
      weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity}&units=imperial&appid=${weatherApiKey}`;
      getWeatherFile(weatherURL);
      forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${requestedCity}units=imperial&appid=${weatherApiKey}`;

      if (!storedSearchObj.includes(requestedCity)) {
        storedSearchObj.unshift(requestedCity);

        if (storedSearchObj.length > 3) storedSearchObj.pop();

        localStorage.setItem("storedCities", JSON.stringify(storedSearchObj));
        if (!prevSearchDiv)
          searchDiv.append(
            '<div id="prev-search-div" class="container"></div>'
          );

        prevSearchDiv = $("#prev-search-div");
        prevSearchDiv.prepend(`<p id="${requestedCity}">${requestedCity}</p>`);
        let pCount = $("#prev-search-div p").length;
        if (pCount > 3) prevSearchDiv.children().last().remove();
      }
    }
  }
});
