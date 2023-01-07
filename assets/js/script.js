//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch'); // jquery selector for the 
var searchBtn = $('.btn'); // jquery selector for the 
var todaysForecastEl = $('#todaysForecast'); // jquery selector for the 
//-- VARIABLE INITIALIZATIONS --//
var cityInputVal = "";
var today = dayjs().format('(M/D/YY)');
var weatherAPI
//-- EVENT LISTENTERS --//
searchBtn.on("click", getCityName);
cityInputEl.on("change", getCityName);

function getCityName() {
    cityInputVal = cityInputEl.val();
    console.log(cityInputVal);
    console.log(today);
    todaysForecastEl.children('h2').text(cityInputVal + " " + today);
}