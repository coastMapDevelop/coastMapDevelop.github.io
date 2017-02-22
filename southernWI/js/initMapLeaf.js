
var myNameSpace;	// allows for exposing functions in main()

function main() {
	/* main variable declarations */
	var geojson; 			// variable to hold county polygons - layer
	var townsPoints;	 	// variable to hold town points - layer
	var citiesPoints;		// variable to hold city points - layer 
	var villagesPoints;		// variable to hold village points - layer
	var townsPolygon;		// variable to hold town polygons - layer
	var citiesPolygon;		// variable to hold city polygons - layer
	var villagesPolygon;	// variable to hold village polygons - layer
	var myMarkers;			// variable to hold markers - animation
	var checkZoom; 			// keeps track of zoom direction
	var currentZoom = 8; 	// keeps track of current zoom
	var circleInterval;		// stores interval variable
	var maxRadius = 30;
	var minRadius = 15;
	var radiusControl = false;
	var firstClick = false;
	var hoverControl = false;
	var remove;		// search panel
	var remove2;	// search control
	/* // main variable declarations */
	
	/* main array declarations */
	var googleSpreadsheet = []; // Array for storing google spreadsheets data: county
	var googleSpreadsheet2 = []; // Array for storing google spreadsheets data: urban
	var pointArray = [];	// holds point features in map
	var polygonArray= [];	// holds polygon features in map
	var currentCheckArr = [];
	var currentSelectArr = ['Cities'];
	var popupCountyArr = [
		['countyLink1', 'Gov Website', 3, 'countyLink1b'],
		['countyLink2', 'Web Map URL', 4, 'countyLink2b'],
		['countyLink3', 'Web Map Other', 5, 'countyLink3b'],
		['countyLink4', 'Web Map State', 6, 'countyLink4b'],
		['countyLink5', 'Comp Plan', 7, 'countyLink5b'],
		['countyLink6', 'Haz Mit Plan', 8, 'countyLink6b'],
		['countyLink7', 'Climate Plan', 9, 'countyLink7b'],
		['countyLink8', 'Resilience Plan', 10, 'countyLink8b'],
		['countyLink9', 'Zoning URL', 11, 'countyLink9b']
	];
	// for naming and assigning popup content for points
	var popupPointArr = [
		['pointLink1', 'Govt Web', 3, 'pointLink1b'],
		['pointLink2', 'Map Web', 4, 'pointLink2b'],
		['pointLink3', 'Comp Plan', 5, 'pointLink3b'],
		['pointLink4', 'Zoning Web', 6, 'pointLink4b'],
		['pointLink5', 'Haz Mit Web', 7, 'pointLink5b'],
		['pointLink6', 'Sus Plan', 8, 'pointLink6b'],
		['pointLink7', 'Cli Plan', 9, 'pointLink7b'],
		['pointLink8', 'Res Plan', 10, 'pointLink8b']
	];
	// for naming and assigning popup content for urban polygons
	var popupPolyArr = [
		['polyLink1', 'Govt Web', 3, 'polyLink1b'],
		['polyLink2', 'Map Web', 4, 'polyLink2b'],
		['polyLink3', 'Comp Plan', 5, 'polyLink3b'],
		['polyLink4', 'Zoning Web', 6, 'polyLink4b'],
		['polyLink5', 'Haz Mit Web', 7, 'polyLink5b'],
		['polyLink6', 'Sus Plan', 8, 'polyLink6b'],
		['polyLink7', 'Cli Plan', 9, 'polyLink7b'],
		['polyLink8', 'Res Plan', 10, 'polyLink8b']
	];
	// array that stores colors for map and legend
	var colorPal = [
		["#003744", "bubble01"],
		["#41b6c4", "bubble02"],
		["#a1dab4", "bubble03"],
		["#ffffcc", "bubble04"]
	];
	var clickedCountyName = [];
	var clickedUrbanName = [];
	var clickedUrbanPolyName = [];
	var supSideArr = [
		['firstBox', 'supSideMenu01'],
		['secondBox', 'supSideMenu02'],
		['thirdBox', 'supSideMenu03']
	];
	var uiMenuArr = [
		['firstBox', 'firstCircle', 'searchPage', 'searchPageToggle'],
		['secondBox', 'secondCircle', 'basemapPage', 'basemapPageToggle'],
		['thirdBox', 'thirdCircle', 'filterPage', 'filterPageToggle'],
		['null', 'null', 'featurePage', 'featurePageToggle'],
		['null', 'supBottomMenu', 'infoPage', 'infoPageToggle']
	];
	/* // main array declarations */
	
	// run authorization for google spreadsheet API
	loadSheetsApi();
	listenToMyForm();
	
	// initiate basemap
    var map = new L.Map('map', {
		attributionControl: true, // add attribution to the map
    	zoomControl: false,		  // add zoom control to the map
        center: [43, -88],		  // coordinates of map initation
		minZoom: 8,				  // minimum zoom level of the map
		maxZoom: 13,
		maxBounds: [
			[30, -105], 	  //southwest bounds
			[55, -70]    	  //northeast bounds
		],
        zoom: 9			  // map initiation zoom level
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
		maxZoom: 8
	});
	
	// esri world imagery
	var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	
	// esri ocean basemap
	var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
		maxZoom: 13
	});
	
	// library for holding base map layer information
	var baseLayers = {
		"Tile_Layer_1": CartoDB_Positron,
		"Tile_Layer_2": CartoDB_DarkMatter,
		"Tile_Layer_3": OpenStreetMap_Mapnik,
		"Tile_Layer_4": Hydda_Full,
		"Tile_Layer_5": Esri_WorldStreetMap,
		"Tile_Layer_6": Esri_WorldPhysical,
		"Tile_Layer_7": Esri_WorldImagery,
		"Tile_Layer_8": Esri_OceanBasemap
	};
	
	var currentLayer = "Tile_Layer_1";	// stores our currently visible base map layer
	baseLayers[currentLayer].addTo(map);	// add tiles to map
	
	var popup = L.popup();	// add hover popup
	
	
	// county style
	var myStyle = {
		"fillColor": colorPal[0][0],
		'weight': 1,
		'opacity': 0.75,
		'color': '#fff',
		'fillOpacity': 0.75,
		'zIndex': 9
	};
	
	// town points style
	var townPointsStyle = {
		radius: 8,
		fillColor: colorPal[2][0],
		color: '#fff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// city points style
	var cityPointsStyle = {
		radius: 8,
		fillColor: colorPal[1][0],
		color: '#fff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// village points style
	var villagePointsStyle = {
		radius: 8,
		fillColor: colorPal[3][0],
		color: '#fff',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// town polygons style
	var townPolygonStyle = {
		fillColor: colorPal[2][0],
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// city polygons style
	var cityPolygonStyle = {
		fillColor: colorPal[1][0],
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// village polygons style
	var villagePolygonStyle = {
		fillColor: colorPal[3][0],
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// on mouseover
	function highlightFeature(e) {
		var layer = e.target; // reference layer
		
		var hoverPanel = document.getElementById("hoverFeaturePage");
		hoverPanel.style.right = "75px";
		
		
		if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == colorPal[0][0]) {
			removePanelInfo("hover");
			// experimental
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "hover");
			/*
			if (hoverControl == false) {
				checkFeaturePage("featurePage");
			}
			*/
			
			
			
			//layer.bindTooltip(layer.feature.properties.NAMELSAD10).openTooltip(); // open tooltip on hover with name of county
			//popup.setLatLng(e.latlng).setContent("test").openOn(map);
		
			// set new style for hover county polygon
			layer.setStyle({
				fillOpacity: 1,
				zIndex: 11
			});
			
		} else if (layer.feature.geometry.type == 'Point' && layer.feature.properties.filter == "true") {	// here, we can decide if filter is true or false
			removePanelInfo("hover");
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "hover");
			
			//layer.bindTooltip(layer.feature.properties.name).openTooltip(); // open tooltip on hover with name of point
			//popup.setLatLng(e.latlng).setContent("test").openOn(map);
					
				
			layer.setStyle({
				weight: 2,
				fillOpacity: 1,
			})
			
		} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != colorPal[0][0]) {
			removePanelInfo("hover");
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "hover");
			
			//layer.bindTooltip(layer.feature.properties.Name_1).openTooltip(); // open tooltip on hover with name of urban polygon
			//popup.setLatLng(e.latlng).setContent("test").openOn(map);
			layer.setStyle({
				weight: 2,
				fillOpacity: 1,
				//color: '#666'
			})
		}
	};
	
	
	
	// on mouseout
	function resetHighlight(e) {
		var hoverPanel = document.getElementById("hoverFeaturePage");
		hoverPanel.style.right = "";
		if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == colorPal[0][0]) {

			geojson.eachLayer(function(layer) {
				if (layer.feature.properties.NAME10 != clickedCountyName[0]) {
					layer.setStyle({fillOpacity: 0.75, weight: 1});
				}
			});
			//geojson.resetStyle(e.target); // reset style of county polygons
		} else if (e.target.feature.geometry.type == 'Point' && e.target.feature.properties.filter == "true") {
			townsPoints.resetStyle(e.target);
			
			citiesPoints.resetStyle(e.target);
			
			villagesPoints.resetStyle(e.target);
		} else if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == colorPal[1][0]) {
			citiesPolygon.resetStyle(e.target);
		} else if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == colorPal[2][0]) {
			townsPolygon.resetStyle(e.target);
		} else if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == colorPal[3][0]) {
			villagesPolygon.resetStyle(e.target);
		}
		//this.closeTooltip(); // close tooltip on mouseout
		//map.closePopup();
	
	};
	
	
	// on click
	function zoomToFeature(e) {
		var layer = e.target; // reference layer
		hoverControl = true;
		
		
		if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == colorPal[0][0]) {
			
			geojson.eachLayer(function(layer) {
				if (layer.feature.properties.NAME10 == clickedCountyName[0]) {
					layer.setStyle({fillOpacity: 0.75, weight: 1});
				}
			});
			clickedCountyName.length = 0;
	
			
			var center = layer.getBounds().getCenter();
			removeMarkers();
			
			clickedCountyName.push(layer.feature.properties.NAME10);
			//console.log(clickedCountyName);
			
			map.setView(center, 10);
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click"); // call function to cross reference clicked layer name with google spreadsheet data

			window.setTimeout(function() {
				checkFeaturePage("featurePage");
			}, 250);
			
		} else if (layer.feature.geometry.type == 'Point' && layer.feature.properties.filter == "true") {
			var center = layer._latlng;
			
			
			clickedUrbanName.length = 0;
			
			removeMarkers();
			clickedUrbanName.push(layer.feature.properties.name);
			
			var marker = L.circleMarker(layer._latlng, {radius: 20, fillOpacity: 0, color: 'white'});
			myMarkers.addLayer(marker);
			myMarkers.bringToBack();
			geojson.bringToBack();
			
			circleInterval = setInterval(function() {
				myMarkers.eachLayer(function (layer) {
    				var radius = layer.getRadius();
    				
    				if (radius == maxRadius) {
    					radiusControl = false;
    				} else if (radius == minRadius) {
    					radiusControl = true;
    				} else if (radius < maxRadius && radius > minRadius) {
    					
    				}
    				
    				if (radiusControl == true) {
    					var newRadius = radius + .5;
    				} else if (radiusControl == false) {
    					var newRadius = radius - .5;
    				}
    				
    				layer.setRadius(newRadius);
    				
    				
    				
				});
			}, 50);
			
			map.setView(center, 10);
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click"); // call function to cross reference clicked layer name with google spreadsheet data

			window.setTimeout(function() {
				checkFeaturePage("featurePage");
			}, 500);
			
		} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != colorPal[0][0]) {
			checkFeaturePage("featurePage");
			clickedUrbanPolyName.length = 0;
			removeMarkers();
			clickedUrbanPolyName.push(layer.feature.properties.Name_1);
			
			crossReference(e, layer ,layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click"); // call function to cross reference clicked layer name with google spreadsheet data
		}
		firstClick = true;
	};
	
	function removeMarkers() {
		myMarkers.clearLayers();
		window.clearInterval(circleInterval);
		
		if (clickedCountyName.length != 0) {
			geojson.eachLayer(function (layer) {
				if (layer.feature.properties.NAME10 == clickedCountyName[0]) {
					layer.setStyle({fillOpacity:0.75, weight: 1});
				}
			});
		}
		clickedCountyName.length = 0;
		
	
		clickedUrbanName.length = 0;
		
	
		clickedUrbanPolyName.length = 0;
	};
	
	/* not in use 
	// function to zoom to clicked feature in query list
	function testZoom(e, position) {
		// check if is county, urban point, or urban polygon
		// check and set zoom levels
		// set bounds or view
		// initiate and fill popup (move filling of popups to new functions)
		if (storedTypeClicked[position] == 'MultiPolygon') {
			map.fitBounds(e.target.getBounds());
			var zoom = map.getZoom();
			if (zoom <= 10) {
				currentZoom = zoom;
				checkZoom = zoom - 1;
				updateZoom();
			} else {
				// do nothing
			}
		} else if (storedTypeClicked[position] == 'Point') {
			map.setView(e.latlng, 10);
		}
	};
	  not in use */
	
	
	// adds eventlisteners
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature, // call highlightFeature function on mouseover
			mouseout: resetHighlight,	 // call resetHighlight function on mouseout
			click: zoomToFeature		 // call zoomToFeature function on click
		});
		
		// experimental
		feature.layer = layer;
	};
	
	// function to cross reference name of county polygon with google spreadsheet
	function crossReference(e, layer, props, type, color, clickHov) {
		if (type == 'MultiPolygon' && color == colorPal[0][0]) {
			var target = props.NAME10; // reference
			
			
			// call function to store clicked features
			//stacheClicked(target, e, type);
			removePanelInfo("click");
			/*
			if (firstClick == false) {
				
			} else if (firstClick == true) {
				removePanelInfo("click");
			}
			*/
			
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			var ggleSprd = googleSpreadsheet.length;
			for (i=0; i < ggleSprd; i++) {
				if (target == googleSpreadsheet[i][0]) {
					
					
					addCountyPanelInfo(target, i, clickHov);
					/*
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent("<b id='titlePopup'>" + target + " County</b>" + "<hr class='popupLine'>" + "Population 2000: " + googleSpreadsheet[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet[i][2] + "<br>" + "<br>" + 
						"<b id='govPopup'>Resources</b>" + "<hr class='popupLine'>" + "<a id='countyLink1' target='_blank'>Gov Website</a>" + "<br>" + "<a id='countyLink2' target='_blank'>Web Map URL</a>" + "<br>" + "<a id='countyLink3' target='_blank'>Web Map Other</a>" + "<br>" + 
						"<a id='countyLink4' target='_blank'>Web Map State</a>" + "<br>" + "<a id='countyLink5' target='_blank'>Comp Plan</a>" + "<br>" + "<a id='countyLink6' target='_blank'>Haz Mit Plan</a>" + "<br>" + 
						"<a id='countyLink7' target='_blank'>Climate Plan</a>" + "<br>" + "<a id='countyLink8' target='_blank'>Resilience Plan</a>" + "<br>" + "<a id='countyLink9' target='_blank'>Zoning URL</a>").openOn(map);
					*/
					
					// have to check if link is valid
					// may need to move this to function above
					/*
					var m;
					var ppupCnty = popupCountyArr.length;
					for (m=0; m < ppupCnty; m++) {
						var link = googleSpreadsheet[i][popupCountyArr[m][2]];
						if (link == 'null') {
							// deactivate link
							//document.getElementById(popupCountyArr[m][0]).style.visibility = "hidden";
							//$(popupCountyArr[m][0]).remove();
							document.getElementById(popupCountyArr[m][0]).style.color = "#CCD1D1";
							//document.getElementById(popupCountyArr[m][0]).classList.add('deactivated');
						} else {
							// activate link
							document.getElementById(popupCountyArr[m][0]).setAttribute("href", link);
						}
					}
					*/
				}
			}
			
		} else if (type == 'Point') {
			var target = props.name;
			
			// call function to store clicked features
			//stacheClicked(target, e, type);
			removePanelInfo("click");
			/*
			if (firstClick == false) {
				
			} else if (firstClick == true) {
				removePanelInfo("click");
			}
			*/
			
			
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			var gglSprd2 = googleSpreadsheet2.length;
			for (i=0; i < gglSprd2; i++) {
				if (target == googleSpreadsheet2[i][0]) {
					
					
					
					addUrbanPanelInfo(target, i, clickHov);
					
					
					
					
					/*
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent("<b id='titlePopup'>" + target + "</b>" + "<hr class='popupLine'>" + "Population 2000: " + googleSpreadsheet2[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet2[i][2] + "<br>" + "<br>" + 
						"<b id='govPopup'>Resources</b>" + "<hr class='popupLine'>" + "<a id='pointLink1' target='_blank'>Govt Web</a>" + "<br>" + "<a id='pointLink2' target='_blank'>Map Web</a>" + "<br>" + "<a id='pointLink3' target='_blank'>Comp Plan</a>" + "<br>" + 
						"<a id='pointLink4' target='_blank'>Zoning Web</a>" + "<br>" + "<a id='pointLink5' target='_blank'>Haz Mit Web</a>" + "<br>" + "<a id='pointLink6' target='_blank'>Sus Plan</a>" + "<br>" + 
						"<a id='pointLink7' target='_blank'>Cli Plan</a>" + "<br>" + "<a id='pointLink8' target='_blank'>Res Plan</a>").openOn(map);
					// add other positions in array
					*/
					
					// have to check if link is valid
					/*
					var m;
					var ppupPnt = popupPointArr.length;
					for (m=0; m < ppupPnt; m++) {
						var link = googleSpreadsheet2[i][popupPointArr[m][2]];
						if (link == 'null') {
							// deactivate link
							document.getElementById(popupPointArr[m][0]).style.color = "#CCD1D1";
						} else {
							// activate link
							document.getElementById(popupPointArr[m][0]).setAttribute("href", link);
						}
					}
					*/
				}
			}
		} else if (type == 'MultiPolygon' && color != colorPal[0][0]) {
			var target = props.Name_1;
			
			// call function to store clicked features
			//stacheClicked(target, e, type);
			removePanelInfo("click");
			/*
			if (firstClick == false) {
				
			} else if (firstClick == true) {
				
				removePanelInfo("click");
			}
			*/
			
			
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			var gglSprd2 = googleSpreadsheet2.length;
			for (i=0; i < gglSprd2; i++) {
				if (target == googleSpreadsheet2[i][0]) {
					
					addUrbanPanelInfo(target, i, clickHov);
					
					/*
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent("<b id='titlePopup'>" + target + "</b>" + "<hr class='popupLine'>" + "Population 2000: " + googleSpreadsheet2[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet2[i][2] + "<br>" + "<br>" + 
						"<b id='govPopup'>Resources</b>" + "<hr class='popupLine'>" + "<a id='polyLink1' target='_blank'>Govt Web</a>" + "<br>" + "<a id='polyLink2' target='_blank'>Map Web</a>" + "<br>" + "<a id='polyLink3' target='_blank'>Comp Plan</a>" + "<br>" + 
						"<a id='polyLink4' target='_blank'>Zoning Web</a>" + "<br>" + "<a id='polyLink5' target='_blank'>Haz Mit Web</a>" + "<br>" + "<a id='polyLink6' target='_blank'>Sus Plan</a>" + "<br>" + 
						"<a id='polyLink7' target='_blank'>Cli Plan</a>" + "<br>" + "<a id='polyLink8' target='_blank'>Res Plan</a>").openOn(map);
					// add other positions in array
					*/
					
					// have to check if link is valid
					/*
					var m;
					var ppupPly = popupPolyArr.length;
					for (m=0; m < ppupPly; m++) {
						var link = googleSpreadsheet2[i][popupPolyArr[m][2]];
						if (link == 'null') {
							// deactivate link
							document.getElementById(popupPolyArr[m][0]).style.color = "#CCD1D1";
						} else {
							// activate link
							document.getElementById(popupPolyArr[m][0]).setAttribute("href", link);
						}
					}
					*/
				}
			}
		}
	};
	
	
	map.on('zoom', function(e) {
		checkZoom = currentZoom; // lag behind current zoom
		currentZoom = map.getZoom(); // update continuously with zoom
		
		if ((checkZoom - currentZoom) < 0) {
			checkZoom = currentZoom - 1;
		} else if ((checkZoom - currentZoom) > 0) {
			checkZoom = currentZoom + 1;
		}
		
		updateZoom(); // call function to check whether to add points or polygons based on direction and current zoom
	});
	
	/*
	// function to add list of names to recent clicks
	function stacheClicked(target, e, type) {
		var container = document.getElementById('queryContainer');
		
		if (recentClickArr.indexOf(target) < 0) {
			recentClickArr.splice(0, 0, target);
			storedEClicked.splice(0, 0, e);
			storedTypeClicked.splice(0, 0, type);
			if (recentClickArr.length > 5) {
				recentClickArr.splice(5, 1);
				storedEClicked.splice(5, 1);
				storedTypeClicked.splice(5, 1);
				container.removeChild(container.childNodes[3]);
			}
			console.log(recentClickArr);
			
			//var queryButton = document.getElementById('queryButton');
			//queryButton.style.cursor = 'pointer';
			//queryButton.style.color = 'black';
			//queryButton.classList.add('active');
			
			
			// add a queryRow to the queryContainer
			var para = document.createElement("p");
			var node = document.createTextNode(target);
			para.appendChild(node);
			
			var element = document.createElement("div");
			element.classList.add('queryRow');
			element.setAttribute("id", target);
			element.setAttribute("onclick", "clickedQueryItem(this.id)");
			element.appendChild(para);
			
			//container.appendChild(element);
			
		} else if (recentClickArr.indexOf(target) >= 0) {
			console.log(recentClickArr);
		}
	};
	*/
	
	// function to check whether to add points or polygons to the map based on zoom 
	function updateZoom() {
		var pntA = pointArray.length;
		var plyA = polygonArray.length;
		if (checkZoom <= 11 && currentZoom <= 10) {
			// check which layers are currently active
			
			var i;
			for(i=0; i < pntA; i++) {
				map.addLayer(pointArray[i]);
				myMarkers.setStyle({opacity: 1});
			}
			
			var j;
			for (j=0; j < plyA; j++) {
				map.removeLayer(polygonArray[j]);
			}
		} else if (checkZoom >= 10 && currentZoom >= 11) {
			// check which layers are currently active
			
			var i;
			for(i=0; i < pntA; i++) {
				map.removeLayer(pointArray[i]);
				myMarkers.setStyle({opacity: 0});
			}
			
			var j;
			for (j=0; j < plyA; j++) {
				map.addLayer(polygonArray[j]);
			}
			
		}
	};
	
	
	$.ajax({
		dataType: "json",
		url: "data/southernWIGeojson/southernWIPolygons.geojson",
		success: function(data) {
			searchCtrl.indexFeatures(data, ['NAME10', 'NAMELSAD10', 'Name_1']);
			geojson = L.geoJson(data, {
				style: myStyle,
				onEachFeature: onEachFeature,
				filter: function(feature, layer) {
					return feature.properties.COUNTYFP10;
				}
			}).addTo(map);
			
			myMarkers = L.featureGroup().addTo(map);
			
			citiesPolygon = L.geoJson(data, {
				style: cityPolygonStyle,		// set style to urbanPolygonStyle variable
				onEachFeature: onEachFeature,	// set onEachFeature to onEachFeature function
				filter: function(feature, layer) {
					if (feature.properties.LSAD == 25) {
						return feature;
					}
				}
			});
			polygonArray.push(citiesPolygon);
			
			townsPolygon = L.geoJson(data, {
				style: townPolygonStyle,		// set style to urbanPolygonStyle variable
				onEachFeature: onEachFeature,	// set onEachFeature to onEachFeature function
				filter: function(feature, layer) {
					if (feature.properties.LSAD == 43) {
						return feature;
					}
				}
			});
			polygonArray.push(townsPolygon);
			
			villagesPolygon = L.geoJson(data, {
				style: villagePolygonStyle,		// set style to urbanPolygonStyle variable
				onEachFeature: onEachFeature,	// set onEachFeature to onEachFeature function
				filter: function(feature, layer) {
					if (feature.properties.LSAD == 47) {
						return feature;
					}
				}
			});
			polygonArray.push(villagesPolygon);
			
			addPointLayers();
		}
	});
	
	
	function addPointLayers() {
		$.ajax({
			dataType: "json",
			url: "data/southernWIGeojson/urbanPoints.geojson",
			success: function(data) {
				townsPoints = L.geoJson(data, {
					// convert markers to points
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, townPointsStyle);
					},
					onEachFeature: onEachFeature,
					filter: function(feature, layer) {
						if (feature.properties.LSAD == 43) {
							return feature;
						}
					}
				})
				.addTo(map);
				pointArray.push(townsPoints);
				
				citiesPoints = L.geoJson(data, {
					// convert markers to points
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, cityPointsStyle);
					},
					onEachFeature: onEachFeature,
					filter: function(feature, layer) {
						if (feature.properties.LSAD == 25) {
							return feature;
						}
					}
				})
				.addTo(map);
				pointArray.push(citiesPoints);
			
				villagesPoints = L.geoJson(data, {
					// convert markers to points
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, villagePointsStyle);
					},
					onEachFeature: onEachFeature,
					filter: function(feature, layer) {
						if (feature.properties.LSAD == 47) {
							return feature;
						}
					}
				})
				.addTo(map);
				pointArray.push(villagesPoints);
			}
		});
		initiateMapColors();
	};
	
	
	
	
	
	function toggle(source, x) {
		if (x == 0) {
			// remove layer
			if (source == "bubble01") {
				map.removeLayer(geojson);
			} else if (source == "bubble02") {
				map.removeLayer(citiesPoints);
				map.removeLayer(citiesPolygon);
				
				var pointSpot = pointArray.indexOf(citiesPoints);
				var polygonSpot = polygonArray.indexOf(citiesPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
		
			} else if (source == "bubble03") {
				map.removeLayer(townsPoints);
				map.removeLayer(townsPolygon);
				
				var pointSpot = pointArray.indexOf(townsPoints);
				var polygonSpot = polygonArray.indexOf(townsPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
		
				
			} else if (source == "bubble04") {
				map.removeLayer(villagesPoints);
				map.removeLayer(villagesPolygon);
				
				var pointSpot = pointArray.indexOf(villagesPoints);
				var polygonSpot = polygonArray.indexOf(villagesPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				
			}
		} else if (x == 1) {
			// add layer
			if (source == "bubble01") {
				map.addLayer(geojson);
				geojson.bringToBack();
			} else if (source == "bubble02") {
				// check zoom level
				if (currentZoom >= 11) {
					map.addLayer(citiesPolygon);
				} else if (currentZoom <= 10) {
					map.addLayer(citiesPoints);
				}
				polygonArray.push(citiesPolygon);
				pointArray.push(citiesPoints);
			} else if (source == "bubble03") {
				// check zoom level
				if (currentZoom >= 11) {
					map.addLayer(townsPolygon);
				} else if (currentZoom <= 10 ) {
					map.addLayer(townsPoints);
				}
				polygonArray.push(townsPolygon);
				pointArray.push(townsPoints);
			} else if (source == "bubble04") {
				// check zoom level
				if (currentZoom >= 11) {
					map.addLayer(villagesPolygon);
				} else if (currentZoom <= 10) {
					map.addLayer(villagesPoints);
				}
				polygonArray.push(villagesPolygon);
				pointArray.push(villagesPoints);
			}
		}
	
	};
	
	// function that allows reseting of the maps extent to original
	/* not in use
	function home() {
		map.setView(new L.LatLng(44, -88), 6);
	};
		not in use */
	
	// function that handles changing of the base map
	function changeBaseMap(source) {
		map.removeLayer(baseLayers[currentLayer]);
		currentLayer = source;
		baseLayers[source].addTo(map);
		
		var image = document.getElementById(source);
		var active = image.classList.contains('active');
		
	};
	
	
	function testFilter() {
		var index;
		var row;
		var theLayer;
		var ppupPnt = popupPointArr.length;
		var gglSprd2 = googleSpreadsheet2.length;
			
		var i;
		var ccChk = currentCheckArr.length;
		for (i=0; i < ccChk; i++) {		// go throuch each attribute in currentCheckArr
			var attribute = currentCheckArr[i];
			
			var z;
			
			for (z=0; z < ppupPnt; z++) {
				if (attribute == popupPointArr[z][1]) {
					index = z;
				}
			}
			 
			 // here we need to loop and specify which layers are clicked
			if (currentSelectArr[0] == "Towns") {
				theLayer = townsPoints;
			} else if (currentSelectArr[0] == "Cities") {
				theLayer = citiesPoints;
			} else if (currentSelectArr[0] == "Villages") {
				theLayer = villagesPoints;
			}
			
			theLayer.eachLayer(function (layer) {			// go through each layer in geojson layer
				var name = layer.feature.properties.name;	// get the name of the layer
				// for this layer only, find the match row on the google spreadsheet
				var m;
				for(m=0; m < gglSprd2; m++) {
					if (name == googleSpreadsheet2[m][0]) {
						var row = m; 			// match row is found
					} else {
						// do nothing
					}
				}
				
				if (googleSpreadsheet2[row][popupPointArr[index][2]] == 'null') {
					// add to array false
					layer.feature.properties.filter = "false";
					layer.setStyle({opacity: '0', fillOpacity: '0'});
					layer.unbindTooltip();
				} else if (googleSpreadsheet2[row][popupPointArr[index][2]] != 'null') {
					// add to array true
					if (layer.feature.properties.filter = "false") {
						layer.feature.properties.filter = "false";
					} else {
						layer.feature.properties.filter = "true";
					}
				}
			});
		}
	};
	
	function resetFilter() {
		var theLayer;
		
		if (currentSelectArr[0] == "Towns") {
			theLayer = townsPoints;
		} else if (currentSelectArr[0] == "Cities") {
			theLayer = citiesPoints;
		} else if (currentSelectArr[0] == "Villages") {
			theLayer = villagesPoints;
		}
			
		theLayer.eachLayer(function (layer) {
			layer.setStyle({opacity: '1', fillOpacity: '0.75'});
			layer.feature.properties.filter = "true";
		});
	};
	
	
	function zoomSearchedFeature(source, num) {
		if (num == 0) {
			geojson.eachLayer(function (layer) {		// go through each layer in county geojson
				var name = layer.feature.properties.NAME10;	// store the name of the layer
			
				if (name == source) {		// of the layer's name equals the clicked sources name
					geojson.eachLayer(function (layer) {
						if (name == layer.feature.properties.NAME10) {
							// zoom to that feature
							//map.fitBounds(layer.getBounds());
							layer.setStyle({fillOpacity: '1'});
							var center = layer.getBounds().getCenter();
							map.setView(center, 10);
							checkFeaturePage("featurePage");
							removeMarkers();
							crossReference(null, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor);
						}
					});
				}
			});
		} else if (num == 1) {
			alert('urban point searched');
			townsPoints.eachLayer(function (layer) {
				var name = layer.feature.properties.name;
				
				if (name == source) {
					urbanSearch(layer);
				}
			});
			
			citiesPoints.eachLayer(function (layer) {
				if (name == source) {
					urbanSearch(layer);
				}
			});
			
			villagesPoints.eachLayer(function (layer) {
				if (name == source) {
					urbanSearch(layer);
				}
			});
		}
		
		function urbanSearch(layer) {
			removeMarkers();

			// add animated point
			// center on point
			// checkfeaturepage
			// crossreference
		};
	};
	
	function storeChecks(source) {
		var isThere = currentCheckArr.indexOf(source);
	
		if (isThere == -1) {
			currentCheckArr.push(source);
		} else if (isThere >= 0) {
			currentCheckArr.splice(isThere, 1);
		}
	};
	
	function listenToMyForm() {
		$('.mySelections').on('change', function(){
			currentSelectArr.length = 0;
			var selected = $(this).find("option:selected").val();
			currentSelectArr.push(selected);
		});
	};
	
	function initiateMapColors() {
		// initiate colors for legend
		document.getElementById(colorPal[0][1]).style.background = colorPal[0][0];
		document.getElementById(colorPal[1][1]).style.background = colorPal[1][0];
		document.getElementById(colorPal[2][1]).style.background = colorPal[2][0];
		document.getElementById(colorPal[3][1]).style.background = colorPal[3][0];
	};
	
	// Load Sheets API client library.
	function loadSheetsApi() {
		var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
		gapi.client.load(discoveryUrl).then(listMajors);
	};

	//Print data from spreadsheet
	// https://docs.google.com/spreadsheets/d/1JMq9zVGVeMIHE5Bj10ngnGFag3glNUV71yKYk4iyjmw/edit#gid=0  = old spreadsheet
	// https://docs.google.com/spreadsheets/d/1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA/edit#gid=0  = new spreadsheet
	function listMajors() {
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA', 	// can be found from link inside (or above)
			range: 'Sheet1!A2:BK', 										   	// get data from Sheet1, and from columns A through BK, starting at row 2
			key: 'AIzaSyDGPkSnN83PuZsEseYhMOSFBH53hpisIRU', 				// google sheets api key, authentication not required for reading
		}).then(function(response) {
			var range = response.result;
			if (range.values.length > 0) {
				for (i=0; i < range.values.length; i++) {
					var row = range.values[i];
					var arr = [row[0], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[17], row[22], row[23], row[24]];
					googleSpreadsheet.push(arr);							// send data to googleSpreadsheet array
				}
			} else {
				console.log('No data found.');
			}
		}, function (response) {
			console.log('Error: ' + response.result.error.message);
		});
	
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA', 	// can be found from link inside (or above)
			range: 'Sheet2!A2:AD', 										   	// get data from Sheet1, and from columns A through AD, starting at row 2
			key: 'AIzaSyDGPkSnN83PuZsEseYhMOSFBH53hpisIRU', 				// google sheets api key, authentication not required for reading
		}).then(function(response) {
			var range = response.result;
			if (range.values.length > 0) {
				for (i=0; i < range.values.length; i++) {
					var row = range.values[i];
					var arr = [row[0], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]];
					googleSpreadsheet2.push(arr);	// send data to googleSpreadsheet array
				}
			} else {
				console.log('No data found.');
			}
		}, function (response) {
			console.log('Error: ' + response.result.error.message);
		});
	};
	
	// function to toggle the visibility of layers in the map
	function toggleLayers(source) {
		// check for an active class to toggle on/off
		var clicked = document.getElementById(source);
		var active = clicked.classList.contains('active');
	
		if (active == true) {
			clicked.classList.remove('active');
			clicked.style.background = '#fff';
			toggle(source, 0);
			// remove layer
		} else if (active == false) {
			clicked.classList.add('active');
			var i;
			for (i=0; i<colorPal.length; i++) {
				if (source == colorPal[i][1]) {
					clicked.style.background = colorPal[i][0];
				}
			}
		
			toggle(source, 1);
			// add layer
		}
	};
	
	
	
	
	
	
	function displaySupMenu(source) {
		var button = document.getElementById(source);
		var active = button.classList.contains("active");
		var position;
		var i;
		for (i=0; i < supSideArr.length; i++) {
			if (source == supSideArr[i][0]) {
				position = supSideArr[i][1];
			}
		}
		var move = document.getElementById(position);
		if (active == true) {
			move.style.left = "100%";
			button.classList.remove("active");
			setTimeout(function(){
				move.style.top = "100%";
				move.style.left = "-150px"
			}, 310);
			setTimeout(function(){
				move.style.top = "0px";
			}, 610);
		} else if (active == false) {
			move.style.left = "75px";
			button.classList.add("active");
		
			// check if other buttons are active, then move if they are
			// if aren't active, do nothing
	
			var n;
			for (n=0; n < supSideArr.length; n++) {
				var check = supSideArr[n][0];
				var box = document.getElementById(check);
				var active1 = box.classList.contains("active");
				if (active1 == true && check != source) {
					var position1 = supSideArr[n][1];
					var remove00 = document.getElementById(position1);
					remove00.style.left = "100%";
					box.classList.remove("active");
					setTimeout(function(){
						remove00.style.top = "100%";
						remove00.style.left = "-150px"
					}, 310);
					setTimeout(function(){
						remove00.style.top = "0px";
					}, 610);
				} else if (active1 == false) {
				
				}
			}
		}
	};
	
	
	function uiHover(source, num) {
		var circle = document.getElementById(source);
		var box;
		var circleCross;
		var uiMnA = uiMenuArr.length;
	
		// loop to find corresponding box
		var i;
		for (i=0; i < uiMnA; i++) {
			if (uiMenuArr[i][1] == source) {
				box = document.getElementById(uiMenuArr[i][0]);
				circleCross = document.getElementById(uiMenuArr[i][2]);
			}
		}
	
		if (num == 1) {
			// hovered, display box
			circle.style.opacity = "1";
			box.style.right = "0";
		} else if (num == 0) {
			// out, remove box
			circle.style.opacity = "";
			box.style.right = "";
		} else if (num == 2) {
			var active = circleCross.classList.contains("active");
			if (active == true) {
				circleCross.style.right = "";
				circleCross.classList.remove("active");
			} else if (active == false) {
				var x = window.innerWidth;
				if (x <= 600) {
					circleCross.style.right = "0";
				} else if (x > 600) {
					circleCross.style.right = "75px";
				}
				circleCross.classList.add("active");
				var j;
				for (j=0; j < uiMnA; j++) {
					if (uiMenuArr[j][1] != source) {
						var checkQuick = document.getElementById(uiMenuArr[j][2]);
						checkQuick.style.right = "";
						checkQuick.classList.remove("active");
					}
				}
				removeMarkers();
			}
		} else if (num == 3) {
			hoverControl = false;
			var q;
			for (q=0; q < uiMnA; q++) {
				if (uiMenuArr[q][3] == source) {
					var position = uiMenuArr[q][2];
					var toggle = document.getElementById(position);
					toggle.style.right = "";
					toggle.classList.remove('active');
				}
			}
			if (source == "featurePageToggle") {
				removeMarkers();
			} else {
				// do nothing
			}
		}
	};

	function checkFeaturePage(source) {
		var page = document.getElementById("featurePage");
		var active = page.classList.contains('active');
	
		if (active == false) {
			var x = window.innerWidth;
		
			if (x <= 600) {
				page.style.right = "0px";
			} else if (x > 600) {
				page.style.right = "75px";
			}
			page.classList.add("active");
		} else if (active == true) {
			// do nothing
		}
	};

	function showMobileMenu(source) {
		var button = document.getElementById(source);
		var page = document.getElementById("supMobileMenu");
		var active = button.classList.contains('active');
	
		if (active == false) {
			page.style.visibility = "visible";
			page.style.right = "0px";
			button.classList.add("active");
			var toggle = document.getElementById('mobileMenuToggle');
			toggle.innerHTML = "close";
		} else if (active == true) {
			page.style.right = "";
			window.setTimeout(function(){ page.style.visibility = "hidden";}, 250);
			button.classList.remove('active');
			var toggle = document.getElementById('mobileMenuToggle');
			toggle.innerHTML = "menu";
		
		
		}
	};
	
	
	function mobileMenuClicked(val) {
		var name;
		if (val == 0) {
			name = document.getElementById("searchPage");
		} else if (val == 1) {
			name = document.getElementById("basemapPage");
		} else if (val == 2) {
			name = document.getElementById("filterPage");
		} else if (val == 3) {
			name = document.getElementById("infoPage");
		}
		
		name.style.right = "0";
	};
	
	
	function addCountyPanelInfo(target, i, clickHov) {
		
		if (clickHov == "click") {
			var title = document.getElementById("featurePageName");
			var page = document.getElementById('featurePage');
			var removeClass = "gonnaRemoveClick";
			var link1Attr = popupCountyArr[0][0];
			var link2Attr = popupCountyArr[1][0];
			var link3Attr = popupCountyArr[2][0];
			var link4Attr = popupCountyArr[3][0];
			var link5Attr = popupCountyArr[4][0];
			var link6Attr = popupCountyArr[5][0];
			var link7Attr = popupCountyArr[6][0];
			var link8Attr = popupCountyArr[7][0];
			var link9Attr = popupCountyArr[8][0];
		} else if (clickHov == "hover") {
			var title = document.getElementById("hoverFeaturePageName");
			var page = document.getElementById("hoverFeaturePage");
			var removeClass = "gonnaRemoveHover";
			var link1Attr = popupCountyArr[0][3];
			var link2Attr = popupCountyArr[1][3];
			var link3Attr = popupCountyArr[2][3];
			var link4Attr = popupCountyArr[3][3];
			var link5Attr = popupCountyArr[4][3];
			var link6Attr = popupCountyArr[5][3];
			var link7Attr = popupCountyArr[6][3];
			var link8Attr = popupCountyArr[7][3];
			var link9Attr = popupCountyArr[8][3];
		}
		
		title.innerHTML = target;
		var pop2000 = document.getElementById("featurePop2000");
		pop2000.innerHTML = "Population 2000: " + googleSpreadsheet[i][1];
		var pop2010 = document.getElementById("featurePop2010");
		pop2010.innerHTML = "Population 2010: " + googleSpreadsheet[i][2];
					
		var link1 = document.createElement("a");
		var link2 = document.createElement("a");
		var link3 = document.createElement("a");
		var link4 = document.createElement("a");
		var link5 = document.createElement("a");
		var link6 = document.createElement("a");
		var link7 = document.createElement("a");
		var link8 = document.createElement("a");
		var link9 = document.createElement("a");
					
		var text1 = document.createTextNode("Gov Website");
		var text2 = document.createTextNode("Web Map URL");
		var text3 = document.createTextNode("Web Map Other");
		var text4 = document.createTextNode("Web Map State");
		var text5 = document.createTextNode("Comp Plan");
		var text6 = document.createTextNode("Haz Mit Plan");
		var text7 = document.createTextNode("Climate Plan");
		var text8 = document.createTextNode("Resilience Plan");
		var text9 = document.createTextNode("Zoning URL")
					
		link1.appendChild(text1);
		link2.appendChild(text2);
		link3.appendChild(text3);
		link4.appendChild(text4);
		link5.appendChild(text5);
		link6.appendChild(text6);
		link7.appendChild(text7);
		link8.appendChild(text8);
		link9.appendChild(text9);
					
		link1.setAttribute("id", link1Attr);
		link2.setAttribute("id", link2Attr);
		link3.setAttribute("id", link3Attr);
		link4.setAttribute("id", link4Attr);
		link5.setAttribute("id", link5Attr);
		link6.setAttribute("id", link6Attr);
		link7.setAttribute("id", link7Attr);
		link8.setAttribute("id", link8Attr);
		link9.setAttribute("id", link9Attr);
					
		link1.setAttribute("target", "_blank");
		link2.setAttribute("target", "_blank");
		link3.setAttribute("target", "_blank");
		link4.setAttribute("target", "_blank");
		link5.setAttribute("target", "_blank");
		link6.setAttribute("target", "_blank");
		link7.setAttribute("target", "_blank");
		link8.setAttribute("target", "_blank");
		link9.setAttribute("target", "_blank");
					
		link1.setAttribute("class", removeClass);
		link2.setAttribute("class", removeClass);
		link3.setAttribute("class", removeClass);
		link4.setAttribute("class", removeClass);
		link5.setAttribute("class", removeClass);
		link6.setAttribute("class", removeClass);
		link7.setAttribute("class", removeClass);
		link8.setAttribute("class", removeClass);
		link9.setAttribute("class", removeClass);
					
		var break1 = document.createElement("br");
		var break2 = document.createElement("br");
		var break3 = document.createElement("br");
		var break4 = document.createElement("br");
		var break5 = document.createElement("br");
		var break6 = document.createElement("br");
		var break7 = document.createElement("br");
		var break8 = document.createElement("br");
		var break9 = document.createElement("br");
					
		break1.setAttribute('id', 'break1');
		break2.setAttribute('id', 'break2');
		break3.setAttribute('id', 'break3');
		break4.setAttribute('id', 'break4');
		break5.setAttribute('id', 'break5');
		break6.setAttribute('id', 'break6');
		break7.setAttribute('id', 'break7');
		break8.setAttribute('id', 'break8');
		break9.setAttribute('id', 'break9');
					
		break1.setAttribute("class", removeClass);
		break2.setAttribute("class", removeClass);
		break3.setAttribute("class", removeClass);
		break4.setAttribute("class", removeClass);
		break5.setAttribute("class", removeClass);
		break6.setAttribute("class", removeClass);
		break7.setAttribute("class", removeClass);
		break8.setAttribute("class", removeClass);
		break9.setAttribute("class", removeClass);
					
		
		page.appendChild(link1);
		page.appendChild(break1);
		page.appendChild(link2);
		page.appendChild(break2);
		page.appendChild(link3);
		page.appendChild(break3);
		page.appendChild(link4);
		page.appendChild(break4);
		page.appendChild(link5);
		page.appendChild(break5);
		page.appendChild(link6);
		page.appendChild(break6);
		page.appendChild(link7);
		page.appendChild(break7);
		page.appendChild(link8);
		page.appendChild(break8);
		page.appendChild(link9);
		page.appendChild(break9);
		
		var m;
		var ppupCnty = popupCountyArr.length;
		for (m=0; m < ppupCnty; m++) {
			var link = googleSpreadsheet[i][popupCountyArr[m][2]];
			if (link == 'null') {
				// deactivate link
				//document.getElementById(popupCountyArr[m][0]).style.visibility = "hidden";
				//$(popupCountyArr[m][0]).remove();
				if (clickHov == "click") {
					document.getElementById(popupCountyArr[m][0]).style.color = "#CCD1D1";
				} else if (clickHov == "hover") {
					document.getElementById(popupCountyArr[m][3]).style.color = "#CCD1D1";
				}
				
				//document.getElementById(popupCountyArr[m][0]).classList.add('deactivated');
			} else {
				// activate link
				if (clickHov == "click") {
					document.getElementById(popupCountyArr[m][0]).setAttribute("href", link);
				} else if (clickHov == "hover") {
					document.getElementById(popupCountyArr[m][3]).setAttribute("href", link);
				}
				
			}
		}
	};
	
	function removePanelInfo(clickHov) {
		if (clickHov == "click") {
			console.log('test');
			var para = document.getElementsByClassName('gonnaRemoveClick');
			console.log('test2');
			while (para[0]) {
				console.log('test3');
				para[0].parentNode.removeChild(para[0]);
			}
		} else if (clickHov == "hover") {
			var para = document.getElementsByClassName('gonnaRemoveHover');
			while (para[0]) {
				para[0].parentNode.removeChild(para[0]);
			}
		}
		
	};
	
	
	function addUrbanPanelInfo(target, i, clickHov) {
	
		if (clickHov == "click") {
			var title = document.getElementById("featurePageName");
			var page = document.getElementById('featurePage');
			var removeClass = "gonnaRemoveClick";
			var link1Attr = popupPointArr[0][0];
			var link2Attr = popupPointArr[1][0];
			var link3Attr = popupPointArr[2][0];
			var link4Attr = popupPointArr[3][0];
			var link5Attr = popupPointArr[4][0];
			var link6Attr = popupPointArr[5][0];
			var link7Attr = popupPointArr[6][0];
			var link8Attr = popupPointArr[7][0];
		} else if (clickHov == "hover") {
			var title = document.getElementById("hoverFeaturePageName");
			var page = document.getElementById("hoverFeaturePage");
			var removeClass = "gonnaRemoveHover";
			var link1Attr = popupPointArr[0][3];
			var link2Attr = popupPointArr[1][3];
			var link3Attr = popupPointArr[2][3];
			var link4Attr = popupPointArr[3][3];
			var link5Attr = popupPointArr[4][3];
			var link6Attr = popupPointArr[5][3];
			var link7Attr = popupPointArr[6][3];
			var link8Attr = popupPointArr[7][3];
		}
		
		
		title.innerHTML = target;
		var pop2000 = document.getElementById("featurePop2000");
		pop2000.innerHTML = "Population 2000: " + googleSpreadsheet2[i][1];
		var pop2010 = document.getElementById("featurePop2010");
		pop2010.innerHTML = "Population 2010: " + googleSpreadsheet2[i][2];
					
		var link1 = document.createElement("a");
		var link2 = document.createElement("a");
		var link3 = document.createElement("a");
		var link4 = document.createElement("a");
		var link5 = document.createElement("a");
		var link6 = document.createElement("a");
		var link7 = document.createElement("a");
		var link8 = document.createElement("a");
					
		var text1 = document.createTextNode("Gov Website");
		var text2 = document.createTextNode("Web Map URL");
		var text3 = document.createTextNode("Comp Plan");
		var text4 = document.createTextNode("Zoning Web");
		var text5 = document.createTextNode("Haz Mit Web");
		var text6 = document.createTextNode("Sus Plan");
		var text7 = document.createTextNode("Cli Plan");
		var text8 = document.createTextNode("Res Plan");
					
		link1.appendChild(text1);
		link2.appendChild(text2);
		link3.appendChild(text3);
		link4.appendChild(text4);
		link5.appendChild(text5);
		link6.appendChild(text6);
		link7.appendChild(text7);
		link8.appendChild(text8);
					
		link1.setAttribute("id", link1Attr);
		link2.setAttribute("id", link2Attr);
		link3.setAttribute("id", link3Attr);
		link4.setAttribute("id", link4Attr);
		link5.setAttribute("id", link5Attr);
		link6.setAttribute("id", link6Attr);
		link7.setAttribute("id", link7Attr);
		link8.setAttribute("id", link8Attr);
					
		link1.setAttribute("target", "_blank");
		link2.setAttribute("target", "_blank");
		link3.setAttribute("target", "_blank");
		link4.setAttribute("target", "_blank");
		link5.setAttribute("target", "_blank");
		link6.setAttribute("target", "_blank");
		link7.setAttribute("target", "_blank");
		link8.setAttribute("target", "_blank");
					
		link1.setAttribute("class", removeClass);
		link2.setAttribute("class", removeClass);
		link3.setAttribute("class", removeClass);
		link4.setAttribute("class", removeClass);
		link5.setAttribute("class", removeClass);
		link6.setAttribute("class", removeClass);
		link7.setAttribute("class", removeClass);
		link8.setAttribute("class", removeClass);
					
		var break1 = document.createElement("br");
		var break2 = document.createElement("br");
		var break3 = document.createElement("br");
		var break4 = document.createElement("br");
		var break5 = document.createElement("br");
		var break6 = document.createElement("br");
		var break7 = document.createElement("br");
		var break8 = document.createElement("br");
					
		break1.setAttribute('id', 'break1');
		break2.setAttribute('id', 'break2');
		break3.setAttribute('id', 'break3');
		break4.setAttribute('id', 'break4');
		break5.setAttribute('id', 'break5');
		break6.setAttribute('id', 'break6');
		break7.setAttribute('id', 'break7');
		break8.setAttribute('id', 'break8');
					
		break1.setAttribute('class', removeClass);
		break2.setAttribute('class', removeClass);
		break3.setAttribute('class', removeClass);
		break4.setAttribute('class', removeClass);
		break5.setAttribute('class', removeClass);
		break6.setAttribute('class', removeClass);
		break7.setAttribute('class', removeClass);
		break8.setAttribute('class', removeClass);
					
		
		page.appendChild(link1);
		page.appendChild(break1);
		page.appendChild(link2);
		page.appendChild(break2);
		page.appendChild(link3);
		page.appendChild(break3);
		page.appendChild(link4);
		page.appendChild(break4);
		page.appendChild(link5);
		page.appendChild(break5);
		page.appendChild(link6);
		page.appendChild(break6);
		page.appendChild(link7);
		page.appendChild(break7);
		page.appendChild(link8);
		page.appendChild(break8);
		
		var m;
		var ppupPnt = popupPointArr.length;
		for (m=0; m < ppupPnt; m++) {
			var link = googleSpreadsheet2[i][popupPointArr[m][2]];
			if (link == 'null') {
				// deactivate link
				if (clickHov == "click") {
					document.getElementById(popupPointArr[m][0]).style.color = "#CCD1D1";
				} else if (clickHov == "hover") {
					document.getElementById(popupPointArr[m][3]).style.color = "#CCD1D1";
				}
				
			} else {
				// activate link
				if (clickHov == "click") {
					document.getElementById(popupPointArr[m][0]).setAttribute("href", link);
				} else if (clickHov == "hover") {
					document.getElementById(popupPointArr[m][3]).setAttribute("href", link);
				}
				
			}
		}
	};
	
	
	
	
	
	
	
	// experimental
	var options = {
		position: 'topleft',
		title: 'Search',
		placeholder: 'Racine',
		panelTitle: '',
		maxResultLength: 10,
		showInvisibleFeatures: true,
		caseSensitive: false,
		threshold: 0,
		showResultFct: function (feature, container) {
			props = feature.properties;
			var name = L.DomUtil.create('b', null, container);
			if (props.NAME10 != null) {
				name.innerHTML = props.NAME10;
				name.setAttribute("id", props.NAME10);
				name.setAttribute("onclick", "myNameSpace.zoomSearchedFeature(this.id, 0)");
				container.appendChild(L.DomUtil.create('br', null, container));
				container.appendChild(document.createTextNode(props.NAMELSAD10));
			} else if (props.NAME10 == null) {
				name.innerHTML = props.Name_1;
				name.setAttribute("id", props.Name_1);
				name.setAttribute("onclick", "myNameSpace.zoomSearchedFeature(this.id, 1)");
				container.appendChild(L.DomUtil.create('br', null, container));
				container.appendChild(document.createTextNode(props.NAMELSAD));
			}
		}
	};
	var searchCtrl = L.control.fuseSearch(options);
	searchCtrl.addTo(map);
	
	remove = document.getElementById('mySearchPanel'); 
	remove.parentNode.removeChild(remove);
	remove2 = document.getElementById('mySearchContainer');
	remove2.parentNode.removeChild(remove2);
	
	var add = document.getElementById("searchPage");
	add.appendChild(remove);
	//add.appendChild(remove2);
	
	
	$('.leaflet-control-attribution').detach().appendTo('#infoPage');
	
	
	// experimental
	
	
	// fill name space with function variables so we can use them publicly
	myNameSpace = {
		toggle: toggle,
		changeBaseMap: changeBaseMap,
		removeMarkers: removeMarkers,
		testFilter: testFilter,
		zoomSearchedFeature: zoomSearchedFeature,
		resetFilter: resetFilter,
		storeChecks: storeChecks,
		listenToMyForm: listenToMyForm,
		toggleLayers: toggleLayers,
		displaySupMenu: displaySupMenu,
		uiHover: uiHover,
		showMobileMenu: showMobileMenu,
		mobileMenuClicked: mobileMenuClicked
	};

};






// start main function on window load
window.onload = main;



