var formEl = $("#form");
var searchInputEl = $("#search_input");
function init() {}
formEl.on("submit", function (e) {
  e.preventDefault();
  console.log(searchInputEl.val());
});
