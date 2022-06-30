var formEl = $("#form");
var searchInputEl = $("#search_input");
var directionsEl = $("#initial_stmt");
var showDetailsEl = $("#show_details");
var cityNameEl = $("#city_name");
var currentDateEl = $("#current_date");
var cityInput;
var savedData;

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
  searchInputEl.val("");

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

  //change values for city name, date, temp, humidity, wind speed, and uv index
  cityNameEl.text(cityInput);
  currentDateEl.text(formattedDate);
};
const init = () => {
  //get local storage items and save to variable
  //show search history from the local storage items
  showDetailsEl.hide();
};
init();
