//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch'); // jquery selector for the 
var cityListEl = $('#cityList'); //jquery selector for the 
var searchBtn = $('.btn'); // jquery selector for the 
var todaysForecastEl = $('#todaysForecast'); // jquery selector for the 
var fiveDayForecastEl = $('#fiveDayForecast')
var fiveDayHeader = $('div.col-8 > h4');
var todayTemp = $('#temp');
var todayWind = $('#wind');
var todayHumid = $('#humid'); 
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
    fetchGeo();
}

function fetchGeo() {
    var geoAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityQuery + "&appid=3cd5ec4ae813460e4a92950deefd645a";
    fetch(geoAPI)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    fetchWeather(data);

                });
            }
        })
};

function fetchWeather(geo) {
    lat = JSON.stringify(geo[0].lat);
    lon = JSON.stringify(geo[0].lon);
    weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=3cd5ec4ae813460e4a92950deefd645a&units=imperial&cnt=30";
    fetch(weatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    formatWeather(data);
                });
            }
        })
};

function formatWeather(data) {
    fiveDayForecastEl.empty();
    var temp = data.list[2].main.temp;
    var wind = data.list[2].wind.speed;
    var humid = data.list[2].main.humidity;

    todayTemp.text("Temp: " + temp + "°F");
    todayWind.text("Wind: " + wind + " MPH");
    todayHumid.text("Humidity: " + humid + " %");
    fiveDayHeader.text("5-Day Forecast:")

    for (i = 7; i < data.list.length; i+=5) {
        var fiveDayEl = $('<div>');
        fiveDayEl.attr("class", "col bg-primary text-white border border-primary rounded");
        var dayHeader = $('<h2>')
        var tempP = $('<p>');
        var windP = $('<p>');
        var humidP = $('<p>');

        fiveDayEl.append(dayHeader);
        fiveDayEl.append(tempP);
        fiveDayEl.append(windP);
        fiveDayEl.append(humidP);
        fiveDayForecastEl.append(fiveDayEl);

        temp = data.list[i].main.temp;
        wind = data.list[i].wind.speed;
        humid = data.list[i].main.humidity;

        fiveDayEl.children().eq(1).text("Temp: " + temp + "°F");
        fiveDayEl.children().eq(2).text("Wind: " + wind + " MPH");
        fiveDayEl.children().eq(3).text("Humidity: " + humid + " %");
        
    }
}
