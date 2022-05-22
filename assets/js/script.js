//https://api.openweathermap.org/data/2.5/weather
//https://openweathermap.org/api/one-call-api

//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid={API key}

//https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

//https://api.openweathermap.org/data/2.5/weather?q=London,uk&callback=test&appid={API key}

//http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}

let requestedCity;

let isGoodCityRequest = function (requestedCity) {
  if (requestedCity && requestedCity != "Enter a City") return true;
  else return false;
};

$("#searchBtn").click(function () {
  requestedCity = $("#searchTxt").val();
  let isGoodRequest = isGoodCityRequest(requestedCity);
  if (isGoodRequest === true) {
    console.log("good request");
  } else {
    console.log("not a good request");
  }
});
