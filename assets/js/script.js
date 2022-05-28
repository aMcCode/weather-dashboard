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
  prevSearchDiv.append(`<p>${searchItm}</p>`);
}

let isGoodCityRequest = function (requestedCity) {
  if (requestedCity) return true;
  else return false;
};

let setPosition = function (jsonFile) {
  city = jsonFile.name;
  lat = jsonFile.coord.lat;
  lon = jsonFile.coord.lon;

  oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  getOneFile(oneCallURL);
};

let packageAndDisplayWeatherData = function (jsonFile) {
  let curIconURL = iconURL + jsonFile.current.weather[0].icon + ".png";
  let text = `<div id="current-forcast-div" class="wide-card">
        <h3>${city} (${jsonFile.current.dt})</h3>
        <img src="${curIconURL}" alt="Icon depicting current weather.">
        <p>Temp: ${jsonFile.current.temp} &deg;F</p>
        <p>Wind: ${jsonFile.current.wind_speed} MPH</p>
        <p>Humidity: ${jsonFile.current.humidity} %</p>
        <p>UV Index: ${jsonFile.current.uvi}</p>
        </div>`;

  forcastDiv.append(text);

  let wklyData = jsonFile.daily;

  for (var i = 0; i < 5; i++) {
    let dailyIconURL = iconURL + wklyData[i].weather[0].icon + ".png";

    if (i === 0)
      forcastDiv.append(
        '<h3 id="5dayH3">5-Day Forcast</h3><div id="daily-forcast-div" class="container"></div>'
      );

    let text = `<div class="daily-card">
        <p>${wklyData[i].dt}</p>
        <img src="${dailyIconURL}" alt="Icon depicting daily weather.">
        <p>Temp: ${wklyData[i].temp.max} &deg;F</p>
        <p>Wind: ${wklyData[i].wind_speed} MPH</p>
        <p>Humidity: ${wklyData[i].humidity} %</p>
      </div>`;

    let dlyWeatherDiv = $("#daily-forcast-div");

    dlyWeatherDiv.append(text);
  }
};

let getWeatherFile = function (URL) {
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
};

let getOneFile = function (URL) {
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
};

$("#searchBtn").click(function () {
  let curFcastDiv = document.getElementById("current-forcast-div");
  let dailyDiv = document.getElementById("daily-forcast-div");
  let h3 = document.getElementById("5dayH3");

  if (curFcastDiv) document.getElementById("current-forcast-div").remove();
  if (dailyDiv) document.getElementById("daily-forcast-div").remove();
  if (h3) document.getElementById("5dayH3").remove();

  requestedCity = $("#searchTxt").val();
  let isGoodRequest = isGoodCityRequest(requestedCity);
  if (isGoodRequest === true) {
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity}&units=imperial&appid=${weatherApiKey}`;
    getWeatherFile(weatherURL);
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${requestedCity}units=imperial&appid=${weatherApiKey}`;

    if (!storedSearchObj.includes(requestedCity)) {
      storedSearchObj.push(requestedCity);

      if (storedSearchObj.length > 3) storedSearchObj.shift();

      localStorage.setItem("storedCities", JSON.stringify(storedSearchObj));
      if (!prevSearchDiv)
        searchDiv.append('<div id="prev-search-div" class="container"></div>');

      prevSearchDiv = $("#prev-search-div");
      prevSearchDiv.prepend(`<p id="${requestedCity}">${requestedCity}</p>`);
      let pCount = $("#prev-search-div p").length;
      if (pCount > 3) prevSearchDiv.children().last().remove();
    }
  } else {
    console.log("not a good request");
  }
});
