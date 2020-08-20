

// the default location hamburg
let myLatLng = { lat: 53.551086, lng: 9.993682 };
let mapOptions = {
  center: myLatLng,
  zoom: 14,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};
//create map
let map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
//create a DirectionsService object to use the route method and get a result for our request
let directionsService = new google.maps.DirectionsService();
//create a DirectionsRenderer object which we will use to display the route
let directionsDisplay = new google.maps.DirectionsRenderer();
//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);
//create autocomplete objects for all inputs
let options = {
  types: ["(place_id)"],
};
let input1 = document.getElementById("from");
let autocomplete1 = new google.maps.places.Autocomplete(input1, options.types);
let input2 = document.getElementById("to");
let autocomplete2 = new google.maps.places.Autocomplete(input2, options.types);

const success = document.getElementById("distanceResult");
const wrong = document.getElementById("distanceNoResult");
const form = document.getElementById("submit");
//addeventliestener to go click and get the diraction
function getData() {
  //create request
  let request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.WALKING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      //Get distance and time
      success.style.display = "unset";
      document.getElementById("weatherResult").style.display = "unset";
      wrong.style.display = "none";
      success.className = "alert-info";
      success.innerHTML = 
        "Form:" +
        document.getElementById("from").value +
        "<br />To:" +
        document.getElementById("to").value +
        ".<br /> Walking distance: " +
        result.routes[0].legs[0].distance.text +
        ".<br />Duration: " +
        result.routes[0].legs[0].duration.text +
        "<br />Calories: " +
        ((result.routes[0].legs[0].distance.value / 1000) * 30).toFixed(2) +
        " kcal";
      //display route
      directionsDisplay.setDirections(result);
    } else {
      //delete route from map
      directionsDisplay.setDirections({ routes: [] });
      //center map in Hamburg
      map.setCenter(myLatLng);
      //show error message
      wrong.className = "alert-danger";
      wrong.innerHTML = "Could not retrieve walk distance!";
      success.style.display="none";
      wrong.style.display="unset";
      document.getElementById("weatherResult").style.display = "none";
    }
  });
}
input2.addEventListener("keypress", (e) => {
  const code = e.keyCode;
  if (code == 13) {
    getData();
    getWeather();
  }
});
form.addEventListener("click", (e) => {
  e.preventDefault();
  getData();
  getWeather();
});

// Weather api
const apiKey = "3afa5bab088848409b0195958201808";
let url;
function getWeather() {
  url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${input2.value}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      let output = `
  <div class="card mt-5"  style="width: 15rem;"  >
      <ul class="list-group list-group-flush d-flex">
      <li class="list-group-item"><img src="${data.current.condition.icon}"/></li>
      <li class="list-group-item">  ${data.location.name} , ${data.location.country}</li>
      <li class="list-group-item">Temperatur : ${data.current.temp_c} C</li>
      <li class="list-group-item">feels : ${data.current.feelslike_c} C</li>
      <li class="list-group-item">humidity : ${data.current.humidity} </li>
      <li class="list-group-item">last-update : ${data.current.last_updated}</li>
      </ul>
    </div>
  `;
      document.getElementById("weatherResult").innerHTML = output;
    });
}
