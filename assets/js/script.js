let storedCities = JSON.parse(localStorage.getItem("storedCities"));

let requestedCity;
let weatherURL, forecastURL, oneCallURL/*, positionURL*/;
let city, lat, lon;
let fullWeatherFile;
const weatherApiKey = "93ed017e828ae552870f8ee1b69cdc22";
// const positionApiKey = "3484e5ac3ed10c19eb4a600978e69a31";
let curWeatherDiv = $("#current-forcast-div");

let isGoodCityRequest = function (requestedCity) {
  if (requestedCity && requestedCity != "Enter a City") return true;
  else return false;
};

let setPosition = function(jsonFile) {
  city = jsonFile.name;
  lat = jsonFile.coord.lat;
  lon = jsonFile.coord.lon;

  oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
    getOneFile(oneCallURL);
}

let packageAndDisplayWeatherData = function (jsonFile) {

    let text = `<h3>${city} (${jsonFile.current.dt})</h3>
        <i>${jsonFile.current.weather[0].icon}</i>
        <p>Temp: ${jsonFile.current.temp}</p>
        <p>Wind: ${jsonFile.current.wind_speed}</p>
        <p>Humidity: ${jsonFile.current.humidity}</p>
        <p>UV Index: ${jsonFile.current.uvi}</p>`;

    curWeatherDiv.append(text);

    let wklyData = jsonFile.daily;

    /* user a for loop here to dynamically create daily cards */

  console.log(wklyData);
};

let getWeatherFile = function(URL) {
    fetch(URL).then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
      setPosition(myJson);
    })
    .catch(function(error) {
        console.log(error);
    });
}

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
  requestedCity = $("#searchTxt").val();
  let isGoodRequest = isGoodCityRequest(requestedCity);
  if (isGoodRequest === true) {
    //   positionURL = `http://api.positionstack.com/v1/forward?access_key=${positionApiKey}&query=${requestedCity.trim()}`;
    // console.log(positionURL);
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity}&units=imperial&appid=${weatherApiKey}`;
    getWeatherFile(weatherURL);
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${requestedCity}units=imperial&appid=${weatherApiKey}`;
    // console.log(forecastURL);
    
  } else {
    console.log("not a good request");
  }
});
