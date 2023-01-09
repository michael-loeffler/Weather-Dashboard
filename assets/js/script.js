//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch'); // jquery selector for the 
var cityListEl = $('#cityList'); //jquery selector for the 
var searchBtn = $('.btn'); // jquery selector for the 
var todaysForecastEl = $('#todaysForecast'); // jquery selector for the 
var iconSpan = $('#iconSpan');
var fiveDayForecastEl = $('#fiveDayForecast')
var fiveDayHeader = $('#fiveDayHeader');
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
    var cityQuery = cityInputVal;
    cityInputEl.val("");
    localStorage.setItem("cityList", JSON.stringify(cityNames));
    $('#cityDate').text(cityInputVal + " " + today);
    todaysForecastEl.addClass('bg-warning border-warning')
    var newCityEl = $('<button>');
    newCityEl.addClass("btn btn-secondary");
    newCityEl.attr("type", "submit");
    newCityEl.text(cityInputVal);
    cityListEl.append(newCityEl);
    fetchGeo(cityQuery);
}

function fetchGeo(cityQuery) {
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
    weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=3cd5ec4ae813460e4a92950deefd645a&units=imperial&cnt=40";
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
    var iconCode = data.list[2].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    iconSpan.attr("src", iconURL);
        
    todayTemp.text("Temp: " + temp + "°F");
    todayWind.text("Wind: " + wind + " MPH");
    todayHumid.text("Humidity: " + humid + " %");

    fiveDayHeader.text("5-Day Forecast:")

    for (i = 0; i < data.list.length; i++) {
        var date = data.list[i].dt_txt;
        var hour = dayjs(date).format('H')
        // console.log(hour);
        date = dayjs(date).format('(M/D/YY)');
        if (hour == 12) { // logs the weather data everyday at noon for each day of the 5 day forecast
            var fiveDayEl = $('<div>');
            fiveDayEl.attr("class", "col bg-primary text-white border border-primary rounded p-2");
            var dayHeader = $('<h4>')
            var fiveIconSpan = $('<img>')
            var tempP = $('<p>');
            var windP = $('<p>');
            var humidP = $('<p>');
    
            fiveDayEl.append(dayHeader);
            fiveDayEl.append(fiveIconSpan);
            fiveDayEl.append(tempP);
            fiveDayEl.append(windP);
            fiveDayEl.append(humidP);
            fiveDayForecastEl.append(fiveDayEl);
            
            iconCode = data.list[i].weather[0].icon;
            iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            fiveIconSpan.attr("src", iconURL);
            temp = data.list[i].main.temp;
            wind = data.list[i].wind.speed;
            humid = data.list[i].main.humidity;

            dayHeader.text(date);
            tempP.text("Temp: " + temp + "°F");
            windP.text("Wind: " + wind + " MPH");
            humidP.text("Humidity: " + humid + " %");
        }
    }
}


function getCityNameFromHistory (event) {
    var storedCityName = event.target.textContent;
    $('#cityDate').text(storedCityName + " " + today);
    fetchGeo(storedCityName)
}

cityListEl.on("click", getCityNameFromHistory);