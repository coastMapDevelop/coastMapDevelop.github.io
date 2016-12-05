
// My Project - schuyler williams google maps API key

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 43.0731, lng: -89.4012},
		zoom: 6
	});
};