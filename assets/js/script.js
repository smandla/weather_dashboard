/** get elements  */
var formEl = $("#form");
var searchInputEl = $("#search_input");
var directionsEl = $("#initial_stmt");
var showDetailsEl = $("#show_details");
var forecastDetailsEl = $("#forecast_details");
var forecastCardsEl = $("#forecast_cards");
var cityNameEl = $("#city_name");
var currentDateEl = $("#current_date");
var currentIconEl = $("#current_icon");
var currentTempEl = $("#current_temp");
var currentHumidityEl = $("#current_humidity");
var currentWindSpeedEl = $("#current_windSpeed");
var currentUvindexEl = $("#current_uvindex");
var cityHistoryListEl = $("#city_history_list");
var currenticonDescriptionEl = $("#icon_description");

/** variables that are empty */
var cityInput;
var savedData;
var val = "";
var cityHistory = [];

//moment formatting code
var formattedDate = moment().format("dddd, MMMM Do, YYYY");

/** when form is submitted */
formEl.on("submit", function (e) {
  e.preventDefault();
  //grabs search input val
  var searchInput = searchInputEl.val();
  //if it's empty return
  if (searchInput === "") {
    return;
  }
  //make cityInput = searchInput
  cityInput = searchInput;
  //make val = cityInput
  val = cityInput;
  //if cityInput is not in cityHistory then push it to it
  if (!cityHistory.includes(cityInput)) {
    cityHistory.push(cityInput);
  }
  //add to history list
  showHistory(cityInput, cityHistory.indexOf(cityInput));

  //clear search val
  searchInputEl.val("");
  //add to local storage
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  // call getData() function
  getData();
});

/**
 * Function that asynchronously gets the data for current and forecast
 */
const getData = async () => {
  //get city response in order to get lat/long coords
  let cityToLatLonResponse = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput +
      "&units=imperial&appid=71aa7cd481b37deac0ed481ce3ecd9ee"
  );
  //get json object
  let cityData = await cityToLatLonResponse.json();
  if (cityToLatLonResponse) {
    savedData = cityData;
  }

  //get current and daily data
  let cityDetailsResonse = await fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      cityData.coord.lat +
      "&lon=" +
      cityData.coord.lon +
      "&exclude=hourly,minutely,alerts&units=imperial&appid=71aa7cd481b37deac0ed481ce3ecd9ee"
  );
  let cityDetails = await cityDetailsResonse.json();
  //call showData() function to change data on site
  showData(cityDetails);
};

/**
 * Function that displays the data in current section
 */
const showData = (cityDetails) => {
  directionsEl.fadeOut(200, function () {
    $(this).remove();
  });
  showDetailsEl.fadeIn(300);
  forecastDetailsEl.fadeIn(300);

  //change values for city name, date, temp, humidity, wind speed, and uv index
  cityNameEl.text(cityInput);
  currentDateEl.text(formattedDate);
  currentIconEl.attr(
    "src",
    "https://openweathermap.org/img/wn/" +
      cityDetails.current.weather[0].icon +
      "@2x.png"
  );
  currenticonDescriptionEl.text(cityDetails.current.weather[0].description);

  currentTempEl.text(cityDetails.current.temp + "°");
  currentHumidityEl.text(cityDetails.current.humidity + "%");
  currentWindSpeedEl.text(cityDetails.current.wind_speed + "mph");
  var uvi = cityDetails.current.uvi;
  currentUvindexEl.text(uvi);
  if (uvi <= 2) {
    currentUvindexEl.css("background-color", "green");
  }
  if (uvi > 2 && uvi <= 5) {
    currentUvindexEl.css("background-color", "yellow");
  }
  if (uvi > 5 && uvi <= 7) {
    currentUvindexEl.css("background-color", "orange");
  }
  if (uvi > 7 && uvi <= 10) {
    currentUvindexEl.css("background-color", "red");
  }
  if (uvi > 10) {
    currentUvindexEl.css("background-color", "purple");
  }

  showForecastDetails(cityDetails.daily.slice(0, 5));
};

/**
 *
 * Function that displays the forecast details
 */
const showForecastDetails = (data) => {
  //clear forecast cards
  forecastCardsEl.text("");
  //create cards for daily forecast details
  for (let i = 0; i < data.length; i++) {
    let sectionEl = $("<section>").addClass("card").appendTo(forecastCardsEl);
    let date = moment.unix(data[i].dt).toDate();
    let h4El = $("<h4>")
      .text(moment(date).format("MMMM Do, YYYY"))
      .appendTo(sectionEl);
    let imageEl = $("<img>");
    let icon = data[i].weather[0].icon;
    imageEl.attr(
      "src",
      "https://openweathermap.org/img/wn/" + icon + "@2x.png"
    );
    imageEl.attr("style", "filter: grayscale(100%);");
    imageEl.appendTo(sectionEl);
    let h5El = $("<h5>")
      .text("temp: " + data[i].temp.day + "°")
      .appendTo(sectionEl);
    let h5_1El = $("<h5>")
      .text("humidity: " + data[i].humidity + "%")
      .appendTo(sectionEl);
  }
};
/**
 * Function that shows History list by adding li elements at a time
 */
const showHistory = (city, i) => {
  var city = cityHistory[i];
  var li = $("<li>")
    .text(city)
    .attr("id", "history-" + i)
    .on("click", function (e) {
      e.preventDefault();
      cityInput = e.target.innerHTML;
      getData();
    });
  li.appendTo(cityHistoryListEl);
};

const init = () => {
  //get local storage items and save to variable
  var storedData = JSON.parse(localStorage.getItem("cityHistory"));
  if (storedData !== null) {
    cityHistory = storedData;
  }
  /**Add all history items on page load from local storage data */
  for (let i = 0; i < cityHistory.length; i++) {
    showHistory(cityHistory[i], i);
  }
  //hide sections
  showDetailsEl.hide();
  forecastDetailsEl.hide();
};
//call init() function
init();
// localStorage.removeItem("cityHistory");
