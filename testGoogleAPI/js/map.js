
// My Project - schuyler williams google maps API key

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 43.0731, lng: -89.4012},
		zoom: 6
	});
	
	var layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'geometry',
			from: '1l2ADyWAVukfgStGrFCXa9F3TrJIy-jB3V8nV5a4g'
		}
	});
};