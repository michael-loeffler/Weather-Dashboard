# Weather-Dashboard

## Description

This application is a Weather Dashboard, allowing a user to search for a city and be presented with current and future weather data for that city. The app also stores past searches so that the user can quickly view the weather for their favorite cities or places they visit often. The application stores the city names in localStorage so they remain on the page even when the page is refreshed.

I was motivated to create this application because checking the weather is something we all do several times every single day. It is critical for knowing how to dress for the day, how it may impact your commute, or how it can affect your plans. Additionally, as someone with family and friends all over the country, it is nice to have a tool to easily and quickly check in on the weather of my loved ones; either for my own peace of mind, or to stay connected with them in a small way. Knowing the weather is a huge part of daily life, and having a tool you can reliably turn to for quick, accurate, and polished information makes life that much easier. 

Through working on this project, I have learned about fetching data from Server-Side APIs and manipulating the responses to display pertinent information for users of my applications. The sheer amount of useful data in these API calls was surprising to me and makes for so much more detailed and helpful webpages. Some of the biggest points of learning include:

* Leveraging the OpenWeatherMap API to fetch weather data including temperature, wind speed, humidity, and an icon representation of the weather
    * Passing user input into a URL to be fetched
    * Manipulating user data to communicate with the API in its own language (i.e., converting city name in to latitude and longitude)
    * Retrieving pertinent data from the API call and formatting/displaying it for the user
* Using logic to determine if a user has any data stored in localStorage or not to determine what to populate the page with (if anything)
* Using string and array methods to process user input into the desired format (converting input to Title Case, even when input is multiple words)
* Using logic to determine if a user has previously searched for a city, and if so, not adding it to the search history list
* Putting into practice my knowledge of Bootstrap to easily format and style a web page to desired criteria
* Figuring out how to dynamically add to an array and pass it into localStorage for later retrieval
* Leveraging the incredibly useful .empty() jQuery method to clear out an HTML element of all children elements to reset a portion of the page for restyling

## Installation

N/A

## Usage

The Weather Dashboard functions by first accepting user input in the form of a city name search. It then processes and formats that input, stores it in a search history section as well as in localStorage (if it is a new search) and then passes that city name as a query parameter to a series of API fetches. These first fetch gets geographical information based on the city name, and then passes that information onto two other fetches that retrieve current and future weather data respectively. The desired weather data is retrieved from the JSON responses of the API calls to then be formatted and added to the page dynamically using JavaScript to create new HTML elements. If a user clicks on a city in the search history list, they are shown the weather data for that city as if they searched for it in the search box. Finally, every time the page is refreshed, the application checks if there are city names stored in localStorage and if so, renders that information into the search history list so that previously searched cities are always at the user's fingertips.

## Link to deployed application:

[https://michael-loeffler.github.io/Weather-Dashboard/](https://michael-loeffler.github.io/Weather-Dashboard/)

## Preview of application and demonstration of features

![Preview of application and demonstration of features](./assets/images/Weather%20Dashboard.gif)

## Credits

* Mozilla Developer Network
* W3 Schools
* jQuery API Documentation
* Day.js APT Documentation
* Bootstrap Documentation
* OpenWeatherMaps Documentation
* Stack Overflow

## License

MIT License

Copyright (c) [2023] [Michael Loeffler]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---