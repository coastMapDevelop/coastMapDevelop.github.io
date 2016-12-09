
function main() {
	// initiate basemap
    var map = new L.Map('map', {
		attributionControl: true,
    	zoomControl: true,
        center: [44, -88],
		minZoom: 5,
		maxBounds: [
			[25.9, -126.38], //southwest
			[53.4, -68.1]    //northeast
		],
        zoom: 6
    });
	
	// hydda.full tiles
	var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
		attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	
	// hydda.base tiles
	var Hydda_Base = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
		attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	
	// cartodb positron
	var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		maxZoom: 19
	});
	
	// cartodb darkmatter
	var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
		ttribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		maxZoom: 19
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
	CartoDB_DarkMatter.addTo(map);
	
	
	// county variable
	var geojson;
	
	// county style
	var myStyle = {
		"fillColor": 'orange',
		'weight': 1,
		'opacity': 0.75,
		'color': 'white',
		'fillOpacity': 0.75
	};
	
	// on mouseover
	function highlightFeature(e) {
		var layer = e.target;
		this.openPopup();
		
		layer.setStyle({
			weight: 5,
			color: '#666',
			fillOpacity: 1
		});
		
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	};
	
	// on mouseout
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		this.closePopup();
	};
	
	// on click
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
		
		var layer = e.target;
		
		crossReference(layer.feature.properties);
		
		
	};
	
	// adds eventlisteners
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
		
		layer.bindPopup(feature.properties.NAMELSAD10);
	};
	
	
	function crossReference(props) {
		var target = String(props.NAME10);
		
		console.log(target);
		console.log(props.NAME10);
		
		var arrSpot = googleSpreadsheet.indexOf(target);
		
		console.log(arrSpot);
	};
	
	
	
	// loads in geojson data
	$.ajax({
		dataType: "json",
		url: "data/geojson/countyPolygons.geojson",
		success: function(data) {
			geojson = L.geoJson(data, {
				style: myStyle,
				onEachFeature: onEachFeature
			}).addTo(map);
		}
	});
	
	
	
	
	// testing ajax plugin to streamline process
	//var myLayer2 = new L.GeoJson.AJAX("data/geojson/countyPolygons.geojson");
    
	
};

window.onload = main;