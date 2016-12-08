
function main() {
    var map = new L.Map('map', {
    	zoomControl: false,
        center: [43, 0],
        zoom: 3
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
	
	
	
	
	//use ajax to load file
	var myLayer = new L.geoJson();
	
	$.ajax({
		dataType: "json",
		url: "data/geojson/countyPolygons.geojson",
		success: function(data) {
			$(data.features).each(function(key, data) {
				myLayer.addData(data);
			});
		}
	}).error(function() {});
	
	myLayer.addTo(map);
	
	var myLayer2 = new L.GeoJson.AJAX("data/geojson/countyPolygons.geojson");
	
	
	
	//L.geoJson(hydro_s, {style: hydrosStyle}).addTo(hydro);
	/*
	var featureStyle = {
		"color": "#ff7800",
		"weight": 5, 
		"opacity": 0.2
	};
	*/
	
	/*
	var myStyle = {
		"color": "#ff7800",
		"weight": 5,
		"opacity": 0.65
	};

	L.geoJSON(myLines, {
		style: myStyle
	}).addTo(map);
	*/
	
    
    
	
};

window.onload = main;