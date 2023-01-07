//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch'); // jquery selector for the 
var cityListEl = $('#cityList'); //jquery selector for the 
var searchBtn = $('.btn'); // jquery selector for the 
var todaysForecastEl = $('#todaysForecast'); // jquery selector for the 
//-- VARIABLE INITIALIZATIONS --//
var cityInputVal = "";
var cityNames = [];
cityNames = JSON.parse(localStorage.getItem("cityList"));
var today = dayjs().format('(M/D/YY)');

//-- EVENT LISTENTERS --//
// searchBtn.on("click", getCityName);
cityInputEl.on("change", getCityName);

function getCityName() {
    cityInputVal = cityInputEl.val().trim();
    cityNames.push(cityInputVal);
    cityInputEl.val("");
    localStorage.setItem("cityList", JSON.stringify(cityNames));
    todaysForecastEl.children('h2').text(cityInputVal + " " + today);
    var newCityEl = $('<button>');
    newCityEl.addClass("btn btn-secondary");
    newCityEl.attr("type", "submit");
    newCityEl.text(cityInputVal);
    cityListEl.append(newCityEl);
}