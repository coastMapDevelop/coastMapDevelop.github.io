
function main() {
	
	// rune authorization for google spreadsheet API
	loadSheetsApi();
	
	// hack leaflet to not close popup on new popup
	/*
	L.Map = L.Map.extend({
		openPopup: function(popup) {
			// this.closePopup();
			this._popup = popup;
			
			return this.addLayer(popup).fire('popupopen', {popup: this._popup});
		}
	});
	*/
	
	// initiate basemap
    var map = new L.Map('map', {
		attributionControl: true, // add attribution to the map
    	zoomControl: true,		  // add zoom control to the map
        center: [44, -88],		  // coordinates of map initation
		minZoom: 5,				  // minimum zoom level of the map
		maxBounds: [
			[25.9, -126.38], 	  //southwest bounds
			[53.4, -68.1]    	  //northeast bounds
		],
        zoom: 6					  // map initiation zoom level
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
	
	CartoDB_DarkMatter.addTo(map); // add tiles to map
	
	var popup = L.popup(); 	// add hover popup
	
	var geojson; // county variable layer
	var urbanPoints; // urban point variable layer
	
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
		var layer = e.target; // reference layer
		console.log(layer);
		layer.bindTooltip(layer.feature.properties.NAMELSAD10).openTooltip(); // open tooltip on hover with name of county
		
		// set new style for hover county polygon
		layer.setStyle({
			weight: 5,
			color: '#666',
			fillOpacity: 1
		});
		
		// check for browser support
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	};
	
	// on mouseout
	function resetHighlight(e) {
		geojson.resetStyle(e.target); // reset style of county polygons
		this.closeTooltip(); // close tooltip on mouseout
	};
	
	// on click
	function zoomToFeature(e) {
		//map.fitBounds(e.target.getBounds()); // zoom to feature
		var layer = e.target; // reference layer
		crossReference(e, layer, layer.feature.properties); // call function to cross reference clicked layer name with google spreadsheet data
	};
	
	// adds eventlisteners
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature, // call highlightFeature function on mouseover
			mouseout: resetHighlight,	 // call resetHighlight function on mouseout
			click: zoomToFeature		 // call zoomToFeature function on click
		});
	};
	
	// function to cross reference name of county polygon with google spreadsheet
	function crossReference(e, layer, props) {
		var target = props.NAME10; // reference
		
		// loop to retrieve necessary data from spreadsheet 
		var i;
		for (i=0; i < googleSpreadsheet.length; i++) {
			if (target == googleSpreadsheet[i][0]) {
				// set clicked popup with data and add to map
				popup.setLatLng(e.latlng).setContent(target + "<br>" + googleSpreadsheet[i][1] + "<br>" + googleSpreadsheet[i][2] + "<br>" +
					googleSpreadsheet[i][3]).openOn(map);
			}
		}
	};
	
	// loads in geojson data for counties
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
	
	$.ajax({
		dataType: 'json',
		url: "data/geojson/urbanPoints.geojson",
		success: function(data) {
			urbanPoints = L.geoJson(data, {
				onEachFeature: onEachFeature
			}).addTo(map);
		}
	});
	
	
	
	
	// testing ajax plugin to streamline process
	//var myLayer2 = new L.GeoJson.AJAX("data/geojson/countyPolygons.geojson");
    
	
};

window.onload = main; // start on window load