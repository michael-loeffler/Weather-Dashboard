//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch'); // jquery selector for the 
var cityListEl = $('#cityList'); //jquery selector for the 
var searchBtn = $('.btn'); // jquery selector for the 
var todaysForecastEl = $('#todaysForecast'); // jquery selector for the 
//-- VARIABLE INITIALIZATIONS --//
var cityInputVal = "";
var cityNames = [];
var cityQuery = "";
var lat = "";
var lon = "";
var weatherAPI = "";
//cityNames = JSON.parse(localStorage.getItem("cityList"));
var today = dayjs().format('(M/D/YY)');


//-- EVENT LISTENTERS --//
// searchBtn.on("click", getCityName);
cityInputEl.on("change", getCityName);

function getCityName() {
    cityInputVal = cityInputEl.val().trim();
    cityNames.push(cityInputVal);
    cityQuery = cityInputVal;
    cityInputEl.val("");
    localStorage.setItem("cityList", JSON.stringify(cityNames));
    todaysForecastEl.children('h2').text(cityInputVal + " " + today);
    var newCityEl = $('<button>');
    newCityEl.addClass("btn btn-secondary");
    newCityEl.attr("type", "submit");
    newCityEl.text(cityInputVal);
    cityListEl.append(newCityEl);
    fetchWeather();
}

function fetchWeather() {
    var geoAPI = "api.openweathermap.org/geo/1.0/direct?q=" + cityQuery;
    fetch(geoAPI)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    
                    lat = data[0].lat;
                    lon = data[0].lon;
                    console.log(lat);
                    weatherAPI = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon;
                });
            }
        })
   

    fetch(weatherAPI)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);

                });
            }
        })
};