
function main() {
    var map = new L.Map('map', {
    	zoomControl: false,
        center: [44, -88],
        zoom: 6
    });
	
	
	// openstreet map tiles
	var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		zoom: 5,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	
	// esri map tiles
	var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
		zoom: 5,
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
	});
	
	// add tiles to map
	OpenStreetMap_Mapnik.addTo(map);
	
	
	
	var geojson;
	//use ajax to load file
	var myStyle = {
		"fillColor": 'orange',
		'weight': 1,
		'opacity': 0.75,
		'color': 'white',
		'fillOpacity': 0.75
	};
	
	function highlightFeature(e) {
		var layer = e.target;
		
		layer.setStyle({
			weight: 5,
			color: '#666',
			fillOpacity: 1
		});
		
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	};
	
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
	};
	
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	};
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	};
	
	
	
	
	$.ajax({
		dataType: "json",
		url: "data/geojson/countyPolygons.geojson",
		success: function(data) {
			/*
			$(data.features).each(function(key, data) {
				myLayer.addData(data);
			});
			*/
			geojson = L.geoJson(data, {
				style: myStyle,
				onEachFeature: onEachFeature
			}).addTo(map);
		}
	}).error(function() {});
	
	
	
	//var myLayer2 = new L.GeoJson.AJAX("data/geojson/countyPolygons.geojson");
	
	
	
	
	
    
    
	
};

window.onload = main;