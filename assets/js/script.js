//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch'); // jquery selector for the 
var cityListEl = $('#cityList'); //jquery selector for the 
var searchBtn = $('.btn'); // jquery selector for the 
var todaysForecastEl = $('#todaysForecast'); // jquery selector for the 
var cityDateEl = $('#cityDate');
var iconSpan = $('#iconSpan');
var fiveDayForecastEl = $('#fiveDayForecast')
var fiveDayHeader = $('#fiveDayHeader');
var todayTemp = $('#temp');
var todayWind = $('#wind');
var todayHumid = $('#humid');
//-- VARIABLE INITIALIZATIONS --//
var cityInputVal = "";
var cityQuery = "";
var lat = "";
var lon = "";
var weatherAPI = "";
var cityNames = JSON.parse(localStorage.getItem("cityList"));
if (cityNames === null) {
    cityNames = [];
}
var today = dayjs().format('(M/D/YY)');


//-- EVENT LISTENTERS --//
// searchBtn.on("click", getCityName);
cityInputEl.on("change", getCityName);
cityListEl.on("click", getCityNameFromHistory);

function getCityName() {
    cityInputVal = cityInputEl.val().trim();
    var words = cityInputVal.split(' ');
    for (i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        console.log(words[i]);
    }
    cityInputVal = words.join(' ');
    var cityQuery = cityInputVal;
    cityInputEl.val("");
    todaysForecastEl.addClass('bg-warning border-warning');
    cityDateEl.text(cityInputVal + " " + today);
    if ((!cityNames.includes(cityQuery)) || (cityNames.length === 0)) {
        cityNames.push(cityInputVal);
        localStorage.setItem("cityList", JSON.stringify(cityNames));
        var newCityEl = $('<button>');
        newCityEl.addClass("btn btn-secondary");
        newCityEl.attr("type", "submit");
        newCityEl.text(cityInputVal);
        cityListEl.append(newCityEl);
    }
    fetchGeo(cityQuery);
}

function fetchGeo(cityQuery) {
    var geoAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityQuery + "&appid=3cd5ec4ae813460e4a92950deefd645a";
    fetch(geoAPI)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    fetchCurrentWeather(data);
                    fetchForecast(data);
                });
            }
        })
};

function fetchCurrentWeather(geo) {
    lat = JSON.stringify(geo[0].lat);
    lon = JSON.stringify(geo[0].lon);
    weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=3cd5ec4ae813460e4a92950deefd645a&units=imperial";
    fetch(weatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    formatCurrentWeather(data);
                });
            }
        })
};

function fetchForecast(geo) {
    lat = JSON.stringify(geo[0].lat);
    lon = JSON.stringify(geo[0].lon);
    weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=3cd5ec4ae813460e4a92950deefd645a&units=imperial";
    fetch(weatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    formatForecast(data);
                });
            }
        })
};

function formatCurrentWeather(data) {
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humid = data.main.humidity;
    // var date = data.dt;
    // date = dayjs.unix(date).format('M/D/YY')
    // console.log(date);

    var iconCode = data.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    iconSpan.attr("src", iconURL);

    todayTemp.text("Temp: " + temp + "°F");
    todayWind.text("Wind: " + wind + " MPH");
    todayHumid.text("Humidity: " + humid + " %");
}

function formatForecast(data) {
    fiveDayForecastEl.empty();
    fiveDayHeader.text("5-Day Forecast:")

    for (i = 0; i < data.list.length; i++) {
        var date = data.list[i].dt_txt;
        var hour = dayjs(date).format('H')
        date = dayjs(date).format('(M/D/YY)');
        if ((hour == 12) && (date != today)) { // logs the weather data everyday at noon for the next five days. Uses loose equality because the hour variable is returned as a string from dayjs
            // console.log(i);
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


function getCityNameFromHistory(event) {
    var storedCityName = event.target.textContent;
    cityDateEl.text(storedCityName + " " + today);
    todaysForecastEl.addClass('bg-warning border-warning');
    fetchGeo(storedCityName);
}

function renderSearchHistory() {
    var storedCityList = JSON.parse(localStorage.getItem("cityList"));
    if (storedCityList != null) {
    for (i = 0; i < storedCityList.length; i++) {
        var newCityEl = $('<button>');
        newCityEl.addClass("btn btn-secondary");
        newCityEl.attr("type", "submit");
        newCityEl.text(storedCityList[i]);
        cityListEl.append(newCityEl);
    }
}
}

renderSearchHistory();