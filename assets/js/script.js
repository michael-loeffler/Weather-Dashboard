//-- DOM DECLARATIONS --//
var cityInputEl = $('#citySearch');
var cityListEl = $('#cityList');
var searchBtn = $('.btn');
var currentWeatherEl = $('#currentWeather');
var cityDateEl = $('#cityDate');
var iconEl = $('#iconEl');
var forecastEl = $('#forecast')
var forecastHeader = $('#forecastHeader');
var currentTemp = $('#temp');
var currentWind = $('#wind');
var currentHumid = $('#humid');

//-- VARIABLE INITIALIZATIONS --//
var cityInputVal = "";
var cityQuery = "";
var lat = "";
var lon = "";
var today = dayjs().format('(M/D/YY)'); // gets today's date from dayjs
var cityNames = JSON.parse(localStorage.getItem("cityList")); // either pulls the search history list from local storage, or establishes cityNames as an empty array if localStorage is empty
if (cityNames === null) {
    cityNames = [];
}

//-- EVENT LISTENTERS --//
searchBtn.on("click", getCityName);
cityListEl.on("click", getCityNameFromHistory);

//-- GET CITY NAME FUNCTION --//
//-- The getCityName function retrieves the city that the user typed into the search box, does some processing to reformat the user's input into Title Case, clears the search box of content, adds bootstrap style classes to the  currentWeatherEl, and displays the city and today's date in the now Yellow box (currentWeatherEl). This function then checks if a user has searched for a city before (or if the search history is empty). If either condition is met, the function adds the information to local storage and creates a new HTML element to be added to the search history list. Finally, this function advances to the next function by calling the fetchGeo function with cityQuery as a parameter. --// 
function getCityName() {
    //- Processes user input -//
    cityInputVal = cityInputEl.val().trim();
    var words = cityInputVal.split(' ');
    for (i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    cityInputVal = words.join(' ');
    //- Prepares and formats city name and date -//
    var cityQuery = cityInputVal;
    cityInputEl.val("");
    currentWeatherEl.addClass('bg-warning border-warning');
    cityDateEl.text(cityInputVal + " " + today);
    //- Checks to see if a user has searched for a city before, and if not adds it to localStorage and creates an HTML element to be added to the search history list -//
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
};

//-- FETCH GEO FUNCTION --//
//-- The fetchGeo function takes in the user's cityQuery from the previous function, concatenates the API url to be used in the fetch, and then performs the fetch. This API call will accept a city name as a query parameter, and return geographical data for that city, including latitude and longitude. The API calls in the currentWeather and Forecast fetch functions, can only accept latitude and longitude as query parameters, so this function is necessary to convert from city name to lat/lon. The function sends the JSON data returned from the fetch onto the next step by calling both the fetchCurrentWeather and fetchForecast functions. --//
function fetchGeo(cityQuery) {
    var geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityQuery + "&appid=3cd5ec4ae813460e4a92950deefd645a";
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

//-- FETCH CURRENT WEATHER FUNCTION --//
//-- The fetchCurrentWeather function takes in the JSON response from the fetchGeo function, retrives the lat and lon coordinates of the desired city, concatenates the API url to be used in the fetch, and then performs the fetch. This API call will accept lat and lon as query parameters, as well as setting the units to imperial, and return CURRENT weather data for that city, including temperature, wind speed, humidity, and an icon representation. The function sends the JSON data returned from the fetch onto the next step by calling the formatCurrentWeather function. --//
function fetchCurrentWeather(geo) {
    lat = JSON.stringify(geo[0].lat);
    lon = JSON.stringify(geo[0].lon);
    var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=3cd5ec4ae813460e4a92950deefd645a&units=imperial";
    fetch(weatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    formatCurrentWeather(data);
                });
            }
        })
};

//-- FETCH FORECAST FUNCTION --//
//-- The fetchForecast function takes in the JSON response from the fetchGeo function, retrives the lat and lon coordinates of the desired city, concatenates the API url to be used in the fetch, and then performs the fetch. This API call will accept lat and lon as query parameters, as well as setting the units to imperial, and return FORECAST weather data for that city for the next 5 days, including temperature, wind speed, humidity, an icon representation and the date corresponding with the weather data. The function sends the JSON data returned from the fetch onto the next step by calling the formatForecast function. --//
function fetchForecast(geo) {
    lat = JSON.stringify(geo[0].lat);
    lon = JSON.stringify(geo[0].lon);
    weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=3cd5ec4ae813460e4a92950deefd645a&units=imperial";
    fetch(weatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    formatForecast(data);
                });
            }
        })
};

//-- FORMAT CURRENT WEATHER FUNCTION --//
//-- The formatCurrentWeather function retrieves the desired weather data (temp in °F, wind speed in MPH, humidity, and icon code) from the JSON response of the API call in fetchCurrentWeather. It concatenates the source url for the icon and adds that as an attribute to the iconEl. Finally the function writes the weather data into strings that can be added to their respective HTML elements using the .text() method. --//
function formatCurrentWeather(data) {
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humid = data.main.humidity;

    var iconCode = data.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    iconEl.attr("src", iconURL);

    currentTemp.text("Temp: " + temp + "°F");
    currentWind.text("Wind: " + wind + " MPH");
    currentHumid.text("Humidity: " + humid + " %");
};

//-- FORMAT FORECAST FUNCTION --//
//-- The formatForecast function first clears the forecastEl of all contents (i.e., the forecast data from the previously searched city). Then it retrieves the desired weather data (temp in °F, wind speed in MPH, humidity, and icon code) from the JSON response of the API call in fetchCurrentWeather, by running a for loop that compares the timestamp of the data with 12:00 pm. If that particular index is the data for noon for a given day, it will create a card for that day by using jquery to create new HTML elements to hold the data. It concatenates the source url for the icon and adds that as an attribute to the newly made forecastIconEl. Finally the function writes the weather data into strings that can be added to their respective HTML elements using the .text() method. --//
function formatForecast(data) {
    forecastEl.empty();
    forecastHeader.text("5-Day Forecast:")

    for (i = 0; i < data.list.length; i++) {
        var date = data.list[i].dt_txt;
        var hour = dayjs(date).format('H')
        date = dayjs(date).format('(M/D/YY)');
        if ((hour == 12) && (date != today)) { // logs the weather data everyday at noon for the next five days. Uses loose equality because the hour variable is returned as a string from dayjs. It also ensures no data from the current day is logged in this section 

            //- Creates new HTML elements for a given day's weather data to be stored -//
            var fiveDayEl = $('<div>');
            fiveDayEl.attr("class", "col bg-primary text-white border border-primary rounded p-2");
            var dayHeader = $('<h4>')
            var forecastIconEl = $('<img>')
            var tempP = $('<p>');
            var windP = $('<p>');
            var humidP = $('<p>');
            //- Appends all new HTML elements to each other creating a "card" -//
            fiveDayEl.append(dayHeader);
            fiveDayEl.append(forecastIconEl);
            fiveDayEl.append(tempP);
            fiveDayEl.append(windP);
            fiveDayEl.append(humidP);
            forecastEl.append(fiveDayEl);
            //- Retrieves weather data from JSON response -//
            temp = data.list[i].main.temp;
            wind = data.list[i].wind.speed;
            humid = data.list[i].main.humidity;
            iconCode = data.list[i].weather[0].icon;
            //- Writes data into associated elements -//
            iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            forecastIconEl.attr("src", iconURL);

            dayHeader.text(date);
            tempP.text("Temp: " + temp + "°F");
            windP.text("Wind: " + wind + " MPH");
            humidP.text("Humidity: " + humid + " %");
        }
    }
};

//-- GET CITY NAME FROM HISTORY FUNCTION --//
//-- The getCityNameFromHistory function is basically the same as the getCityName function. When clicked, the getCityNamefromHistory function will store the text content of whichever button was clicked on as the new "cityQuery"; herein named "storedCityName". The function will write this info to the currentWeatherEl, and call the fetchGeo function with the storedCityName to proceed with fetching and formatting data same as before, as if the user searched for a city in the search box. --//
function getCityNameFromHistory(event) {
    var storedCityName = event.target.textContent;
    cityDateEl.text(storedCityName + " " + today);
    currentWeatherEl.addClass('bg-warning border-warning');
    fetchGeo(storedCityName);
};

//-- RENDER SEARCH HISTORY FUNCTION --//
//-- The renderSearchHistory function will retrive the array of previously searched city names from localStorage and store it in the variable "storedCityList". If this list is not empty it will create buttons for each city on the list to be displayed as a search history. This function is what populates the search history list with buttons with the information stored in localStorage when the page is reloaded. --//
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
};

renderSearchHistory(); // function call of renderSearchHistory; this will create HTML button elements for all previously searched cities stored in localStorage. This function will run every time the page is refreshed.