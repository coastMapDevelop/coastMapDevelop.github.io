
var myNameSpace;

function main() {
	// run authorization for google spreadsheet API
	loadSheetsApi();
	
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
	
	// world physical tiles
	var Esri_WorldPhysical = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	});
	
	// esri world imagery
	var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	
	// esri ocean basemap
	var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
	});
	
	var baseLayers = {
		"Tile_Layer_1": CartoDB_Positron,
		"Tile_Layer_2": CartoDB_DarkMatter,
		"Tile_Layer_3": OpenStreetMap_Mapnik,
		"Tile_Layer_4": Esri_WorldStreetMap,
		"Tile_Layer_5": Hydda_Full,
		"Tile_Layer_6": Esri_WorldPhysical,
		"Tile_Layer_7": Esri_WorldImagery,
		"Tile_Layer_8": Esri_OceanBasemap
	};
	
	var currentLayer = "Tile_Layer_1";
	// add tiles to map
	baseLayers[currentLayer].addTo(map);
	
	// add hover popup
	var popup = L.popup();
	
	var pointArray = [];
	var polygonArray= [];
	
	var geojson; 			// variable to hold county polygons - layer
	var townsPoints;	 	// variable to hold town points - layer
	var citiesPoints;		// variable to hold city points - layer 
	var villagesPoints;		// variable to hold village points - layer
	var townsPolygon;		// variable to hold town polygons - layer
	var citiesPolygon;		// variable to hold city polygons - layer
	var villagesPolygon;	// variable to hold village polygons - layer
	
	// county style
	var myStyle = {
		"fillColor": '#2471A3',
		'weight': 1,
		'opacity': 0.75,
		'color': '#fff',
		'fillOpacity': 0.75,
		'zIndex': 9
	};

	// town points style
	var townPointsStyle = {
		radius: 8,
		fillColor: '#D68910',
		color: '#fff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.9,
		zIndex: 10
	};
	
	// city points style
	var cityPointsStyle = {
		radius: 8,
		fillColor: '#B03A2E',
		color: '#fff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.9,
		zIndex: 10
	};
	
	// village points style
	var villagePointsStyle = {
		radius: 8,
		fillColor: '#117A65',
		color: '#fff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.9,
		zIndex: 10
	};
	
	// town polygons style
	var townPolygonStyle = {
		fillColor: '#D68910',
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 10
	};
	
	// city polygons style
	var cityPolygonStyle = {
		fillColor: '#B03A2E',
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 10
	};
	
	// village polygons style
	var villagePolygonStyle = {
		fillColor: '#117A65',
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 10
	};
	
	// on mouseover
	function highlightFeature(e) {
		var layer = e.target; // reference layer
		
		if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == '#2471A3') {
			console.log('county multipolygon');
			layer.bindTooltip(layer.feature.properties.NAMELSAD10).openTooltip(); // open tooltip on hover with name of county
		
			// set new style for hover county polygon
			/*
			layer.setStyle({
				weight: 5,
				color: '#666',
				fillOpacity: 1,
				zIndex: 11
			});
			*/
		} else if (layer.feature.geometry.type == 'Point') {
			console.log('point');
			layer.bindTooltip(layer.feature.properties.name).openTooltip(); // open tooltip on hover with name of point
			
		} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != '#2471A3') {
			console.log('urban polygon');
			layer.bindTooltip(layer.feature.properties.Name).openTooltip(); // open tooltip on hover with name of urban polygon
		}
	};
	
	// on mouseout
	function resetHighlight(e) {
		if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == '#2471A3') {
			/*geojson.resetStyle(e.target); // reset style of county polygons*/
		} else {
			console.log('not county polygon');
		}
		this.closeTooltip(); // close tooltip on mouseout
	};
	
	// on click
	function zoomToFeature(e) {
		//map.fitBounds(e.target.getBounds()); // zoom to feature
		var layer = e.target; // reference layer
		
		if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == '#2471A3') {
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor); // call function to cross reference clicked layer name with google spreadsheet data
		} else if (layer.feature.geometry.type == 'Point') {
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type); // call function to cross reference clicked layer name with google spreadsheet data
		} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != '#2471A3') {
			crossReference(e, layer ,layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor); // call function to cross reference clicked layer name with google spreadsheet data
		}
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
	function crossReference(e, layer, props, type, color) {
		if (type == 'MultiPolygon' && color == '#2471A3') {
			var target = props.NAME10; // reference
		
			// loop to retrieve necessary data from spreadsheet 
			var i;
			for (i=0; i < googleSpreadsheet.length; i++) {
				if (target == googleSpreadsheet[i][0]) {
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent(target + " County" + "<br>" + "Population 2000: " + googleSpreadsheet[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet[i][2] + "<br>" +
						"Gov Website: " + googleSpreadsheet[i][3] + "<br>" + "Web Map url: " + googleSpreadsheet[i][4] + "<br>" + "Web Map Other: " + googleSpreadsheet[i][5] + "<br>" + 
						"Web Map State: " + googleSpreadsheet[i][6] + "<br>" + "Comp Plan: " + googleSpreadsheet[i][7] + "<br>" + "Haz Mit Plan: " + googleSpreadsheet[i][8] + "<br>" + 
						"Climate Plan: " + googleSpreadsheet[i][9] + "<br>" + "Resilience Plan: " + googleSpreadsheet[i][10] + "<br>" + "Zoning url: " + googleSpreadsheet[i][11]).openOn(map);
					// add other positions in array
				}
			}
		} else if (type == 'Point') {
			var target = props.name;
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			for (i=0; i < googleSpreadsheet2.length; i++) {
				if (target == googleSpreadsheet2[i][0]) {
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent(target + "<br>" + "Population 2000: " + googleSpreadsheet2[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet2[i][2] + "<br>" + 
					"Govt Web: " + googleSpreadsheet2[i][3] + "<br>" + "Map Web: " + googleSpreadsheet2[i][4] + "<br>" + "Comp Plan: " + googleSpreadsheet2[i][5] + "<br>" + 
					"Zoning Web: " + googleSpreadsheet2[i][6] + "<br>" + "Haz Mit Web: " + googleSpreadsheet2[i][7] + "<br>" + "Sus Plan: " + googleSpreadsheet2[i][8] + "<br>" + 
					"Cli Plan:" + googleSpreadsheet2[i][9] + "<br>" + "Res Plan: " + googleSpreadsheet2[i][10]).openOn(map);
					// add other positions in array
				}
			}
		} else if (type == 'MultiPolygon' && color != '#2471A3') {
			var target = props.Name;
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			for (i=0; i < googleSpreadsheet2.length; i++) {
				if (target == googleSpreadsheet2[i][0]) {
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent(target + "<br>" + "Population 2000: " + googleSpreadsheet2[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet2[i][2] + "<br>" + 
					"Govt Web: " + googleSpreadsheet2[i][3] + "<br>" + "Map Web: " + googleSpreadsheet2[i][4] + "<br>" + "Comp Plan: " + googleSpreadsheet2[i][5] + "<br>" + 
					"Zoning Web: " + googleSpreadsheet2[i][6] + "<br>" + "Haz Mit Web: " + googleSpreadsheet2[i][7] + "<br>" + "Sus Plan: " + googleSpreadsheet2[i][8] + "<br>" + 
					"Cli Plan:" + googleSpreadsheet2[i][9] + "<br>" + "Res Plan: " + googleSpreadsheet2[i][10]).openOn(map);
					// add other positions in array
				}
			}
		}
	};
	
	var checkZoom; // keeps track of zoom direction
	var currentZoom = 6; // keeps track of current zoom
	map.on('zoom', function(e) {
		checkZoom = currentZoom; // lag behind current zoom
		currentZoom = map.getZoom(); // update continuously with zoom
		
		updateZoom(); // call function to check whether to add points or polygons based on direction and current zoom
	});
	
	// function to check whether to add points or polygons to the map based on zoom 
	function updateZoom() {
		if (checkZoom == 10 && currentZoom == 9) {
			// check which layers are currently active
			//urbanPoints.addTo(map);
			//map.removeLayer(urbanPolygons);
			
			var i;
			for(i=0; i < pointArray.length; i++) {
				map.addLayer(pointArray[i]);
			}
			
			var j;
			for (j=0; j < polygonArray.length; j++) {
				map.removeLayer(polygonArray[j]);
			}
		} else if (checkZoom == 9 && currentZoom == 10) {
			// check which layers are currently active
			//map.removeLayer(urbanPoints);
			//urbanPolygons.addTo(map);
			
			var i;
			for(i=0; i < pointArray.length; i++) {
				map.removeLayer(pointArray[i]);
			}
			
			var j;
			for (j=0; j < polygonArray.length; j++) {
				map.addLayer(polygonArray[j]);
			}
			
		}
	};
	
	
	// loads in geojson data for counties
	$.ajax({
		dataType: "json",
		url: "data/geojson/countyPolygons.geojson",
		success: function(data) {
			geojson = L.geoJson(data, {
				style: myStyle,					// set style to myStyle variable
				onEachFeature: onEachFeature	// set onEachFeature to onEachFeature function
			})
			.addTo(map);
			addLayers();
		}
	});
	
	// add separate layers on top of county polygons
	function addLayers() {
		// loads in geojson data for town points
		$.ajax({
			dataType: 'json',
			url: "data/geojson/Towns.geojson",
			success: function(data) {
				townsPoints = L.geoJson(data, {
					// convert markers to points
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, townPointsStyle);
					},
					onEachFeature: onEachFeature
				})
				.addTo(map);
				pointArray.push(townsPoints);
				// .bringToFront();
			}
		});
	
		// loads in geojson data for city points
		$.ajax({
			dataType: 'json',
			url: "data/geojson/Cities.geojson",
			success: function(data) {
				citiesPoints = L.geoJson(data, {
					// convert markers to points
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, cityPointsStyle);
					},
					onEachFeature: onEachFeature
				})
				.addTo(map);
				pointArray.push(citiesPoints);
				// .bringToFront();
			}
		});
	
		// loads in geojson data for village points
		$.ajax({
			dataType: 'json',
			url: "data/geojson/Villages.geojson",
			success: function(data) {
				villagesPoints = L.geoJson(data, {
					// convert markers to points
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, villagePointsStyle);
					},
					onEachFeature: onEachFeature
				})
				.addTo(map);
				pointArray.push(villagesPoints);
				// .bringToFront();
			}
		});
	
		// loads in geojson data for city polygons
		$.ajax({
			dataType: 'json',
			url: "data/geojson/cityPolygons.geojson",
			success: function(data) {
				citiesPolygon = L.geoJson(data, {
					style: cityPolygonStyle,		// set style to urbanPolygonStyle variable
					onEachFeature: onEachFeature	// set onEachFeature to onEachFeature function
				});
				polygonArray.push(citiesPolygon);
			}
		});
	
		// loads in geojson data for town polygons
		$.ajax({
			dataType: 'json',
			url: "data/geojson/townPolygons.geojson",
			success: function(data) {
				townsPolygon = L.geoJson(data, {
					style: townPolygonStyle,		// set style to urbanPolygonStyle variable
					onEachFeature: onEachFeature	// set onEachFeature to onEachFeature function
				});
				polygonArray.push(townsPolygon);
			}
		});
	
		// loads in geojson data for village polygons
		$.ajax({
			dataType: 'json',
			url: "data/geojson/villagePolygons.geojson",
			success: function(data) {
				villagesPolygon = L.geoJson(data, {
					style: villagePolygonStyle,		// set style to urbanPolygonStyle variable
					onEachFeature: onEachFeature	// set onEachFeature to onEachFeature function
				});
				polygonArray.push(villagesPolygon);
			}
		});
	};
	
	// testing ajax plugin to streamline process
	//var myLayer2 = new L.GeoJson.AJAX("data/geojson/countyPolygons.geojson");
	
	
	
	
	function toggle(source, x) {
		if (x == 0) {
			// remove layer
			if (source == "expLayer01") {
				map.removeLayer(geojson);
			} else if (source == "expLayer02") {
				map.removeLayer(citiesPoints);
				map.removeLayer(citiesPolygon);
				
				var pointSpot = pointArray.indexOf(citiesPoints);
				var polygonSpot = polygonArray.indexOf(citiesPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				console.log(pointArray);
				console.log(polygonArray);
		
			} else if (source == "expLayer03") {
				map.removeLayer(townsPoints);
				map.removeLayer(townsPolygon);
				
				var pointSpot = pointArray.indexOf(townsPoints);
				var polygonSpot = polygonArray.indexOf(townsPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				console.log(pointArray);
				console.log(polygonArray);
				
			} else if (source == "expLayer04") {
				map.removeLayer(villagesPoints);
				map.removeLayer(villagesPolygon);
				
				var pointSpot = pointArray.indexOf(villagesPoints);
				var polygonSpot = polygonArray.indexOf(villagesPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				console.log(pointArray);
				console.log(polygonArray);
				
			}
		} else if (x == 1) {
			// add layer
			if (source == "expLayer01") {
				map.addLayer(geojson);
				geojson.bringToBack();
			} else if (source == "expLayer02") {
				// check zoom level
				if (currentZoom >= 10) {
					map.addLayer(citiesPolygon);
				} else if (currentZoom <= 9) {
					map.addLayer(citiesPoints);
				}
				polygonArray.push(citiesPolygon);
				pointArray.push(citiesPoints);
			} else if (source == "expLayer03") {
				// check zoom level
				if (currentZoom >= 10) {
					map.addLayer(townsPolygon);
				} else if (currentZoom <= 9 ) {
					map.addLayer(townsPoints);
				}
				polygonArray.push(townsPolygon);
				pointArray.push(townsPoints);
			} else if (source == "expLayer04") {
				// check zoom level
				if (currentZoom >= 10) {
					map.addLayer(villagesPolygon);
				} else if (currentZoom <= 9) {
					map.addLayer(villagesPoints);
				}
				polygonArray.push(villagesPolygon);
				pointArray.push(villagesPoints);
			}
		}
	
	};
	
	function home() {
		map.setView(new L.LatLng(44, -88), 6);
	};
	
	function changeBaseMap(source) {
		map.removeLayer(baseLayers[currentLayer]);
		currentLayer = source;
		baseLayers[source].addTo(map);
	};
	
	myNameSpace = {
		toggle: toggle,
		home: home,
		changeBaseMap: changeBaseMap
	};
	
	
	
	
};

// start on window load
window.onload = main;


// function to toggle the visibility of layers in the map
function toggleLayers(source) {
	// check for an active class to toggle on/off
	var clicked = document.getElementById(source);
	var active = clicked.classList.contains('active');
	
	if (active == true) {
		clicked.classList.remove('active');
		clicked.style.background = '#fff';
		clicked.style.color = 'black';
		myNameSpace.toggle(source, 0);
		// remove layer
	} else if (active == false) {
		clicked.classList.add('active');
		clicked.style.background = '';
		clicked.style.color = '';
		myNameSpace.toggle(source, 1);
		// add layer
	}
};


