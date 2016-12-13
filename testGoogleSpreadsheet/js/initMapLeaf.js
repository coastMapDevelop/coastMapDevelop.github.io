
function main() {
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
	
	// add hover popup
	var popup = L.popup();
	
	
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
		//this.openPopup();
		layer.bindTooltip(layer.feature.properties.NAMELSAD10).openTooltip();
		
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
		//this.closePopup();
		this.closeTooltip();
	};
	
	// on click
	function zoomToFeature(e) {
		//map.fitBounds(e.target.getBounds());
		
		
		var layer = e.target;
		
		crossReference(e, layer, layer.feature.properties);
		
		
	};
	
	// adds eventlisteners
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	};
	
	
	function crossReference(e, layer, props) {
		var target = props.NAME10;
		
		var i;
		for (i=0; i < googleSpreadsheet.length; i++) {
			if (target == googleSpreadsheet[i][0]) {
				console.log(googleSpreadsheet[i][1]);
				popup.setLatLng(e.latlng).setContent(target + "<br>" + googleSpreadsheet[i][1] + "<br>" + googleSpreadsheet[i][2] + "<br>" +
					googleSpreadsheet[i][3]).openOn(map);
			}
		}
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