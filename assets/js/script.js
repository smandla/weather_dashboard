var formEl = $("#form");
var searchInputEl = $("#search_input");
var directionsEl = $("#initial_stmt");
var showDetailsEl = $("#show_details");
var forecastDetailsEl = $("#forecast_details");
var forecastCardsEl = $("#forecast_cards");
var cityNameEl = $("#city_name");
var currentDateEl = $("#current_date");
var currentTempEl = $("#current_temp");
var currentHumidityEl = $("#current_humidity");
var currentWindSpeedEl = $("#current_windSpeed");
var currentUvindexEl = $("#current_uvindex");
var cityInput;
var savedData;
var cityHistory = [];
//moment formatting code
var formattedDate = moment().format("dddd, MMMM DD, YYYY");

formEl.on("submit", function (e) {
  e.preventDefault();
  var searchInput = searchInputEl.val();
  console.log(searchInput);
  if (searchInput === "") {
    return;
  }
  cityInput = searchInput;
  cityHistory.push(cityInput);
  searchInputEl.val("");
  localStorage.setItem("city_history", JSON.stringify(cityHistory));

  getData();
});

const getData = async () => {
  let cityToLatLonResponse = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput +
      "&units=imperial&appid=71aa7cd481b37deac0ed481ce3ecd9ee"
  );
  let cityData = await cityToLatLonResponse.json();
  if (cityToLatLonResponse) {
    savedData = cityData;
  }
  let cityDetailsResonse = await fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      cityData.coord.lat +
      "&lon=" +
      cityData.coord.lon +
      "&exclude=hourly,minutely,alerts&units=imperial&appid=71aa7cd481b37deac0ed481ce3ecd9ee"
  );
  let cityDetails = await cityDetailsResonse.json();
  showData(cityDetails);
};

const showData = (cityDetails) => {
  console.log(cityDetails);
  directionsEl.fadeOut(200, function () {
    $(this).remove();
  });
  showDetailsEl.fadeIn(300);
  forecastDetailsEl.fadeIn(300);

  //change values for city name, date, temp, humidity, wind speed, and uv index
  cityNameEl.text(cityInput);
  currentDateEl.text(formattedDate);
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
  showForecastDetails(cityDetails.daily.slice(1, 6));
};

const showForecastDetails = (data) => {
  console.log(data);
  forecastCardsEl.text("");
  for (let i = 0; i < data.length; i++) {
    let sectionEl = $("<section>").addClass("card").appendTo(forecastCardsEl);
    let date = moment.unix(data[i].dt).toDate();

    // console.log(date);
    let h4El = $("<h4>")
      .text(moment(date).format("MMMM Do, YYYY"))
      .appendTo(sectionEl);
    let h5El = $("<h5>")
      .text("temp: " + data[i].temp.day + "°")
      .appendTo(sectionEl);
    let h5_1El = $("<h5>")
      .text("humidity: " + data[i].humidity + "%")
      .appendTo(sectionEl);
  }
};
const init = () => {
  //get local storage items and save to variable
  //show search history from the local storage items
  showDetailsEl.hide();
  forecastDetailsEl.hide();
};
init();
