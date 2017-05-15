
var myNameSpace;	// allows for exposing functions in main()

function main() {
	/* main variable declarations */
	var geojson; 				// variable to hold county polygons - layer
	var townsPoints;	 		// variable to hold town points - layer
	var citiesPoints;			// variable to hold city points - layer 
	var villagesPoints;			// variable to hold village points - layer
	var townsPolygon;			// variable to hold town polygons - layer
	var citiesPolygon;			// variable to hold city polygons - layer
	var villagesPolygon;		// variable to hold village polygons - layer
	var myMarkers;				// variable to hold markers - animation
	var checkZoom; 				// keeps track of zoom direction
	var currentZoom = 6; 		// keeps track of current zoom
	var circleInterval;			// stores interval variable
	var maxRadius = 30;			// stores maximum radius of circle throbber
	var minRadius = 15;			// stores minimum radius of circle throbber
	var radiusControl = false;	// stores boolean value for circle throbber
	//var firstClick = false;		// stores if the map has yet been clicked
	//var hoverControl = false;	// stores boolean value for hovering - currently not in use (delete?) (check)
	var remove;					// for storing search panel
	var remove2;				// for storing search control
	var hoverPanel = document.getElementById("hoverFeaturePage");	// stores the hover feature page
	var countyZoomFillControl = false;
	var countyClickedZoomControl = false;
	var isMobile = false;
	var polyZoomC = true;
	var pointZoomC = true;
	var hasFilter = false;
	var windowChange = false;
	var holdZoomSource;
	var holdZoomNum;
	var myMarkerColor = "white";
	var myPointColor = "white";
	var hashFilterVar = "myTestFilter";
	/* // main variable declarations */
	
	/* main array declarations */
	var googleSpreadsheet = []; 	// Array for storing google spreadsheets data: county
	var googleSpreadsheet2 = []; 	// Array for storing google spreadsheets data: urban
	var pointArray = [];			// holds point features in map
	var polygonArray= [];			// holds polygon features in map
	var currentCheckArr = [];		// holds attributes for filtering
	var currentSelectArr = ['All'];	// holds layers for filtering
	var allSelectArr = ['Cities', 'Villages', 'Towns', 'Counties'];	// holds all layers for filtering all layers
	var urbanSelectArr = ['Cities', 'Villages', 'Towns'];
	var countySelectArr = ['Counties'];
	// for naming and assigning popup contents for points
	var popupCountyArr = [
		['countyLink1', 'GovtWebURL', 8, 'countyLink1b'],
		['countyLink2', 'WebMapURL', 11, 'countyLink2b'],
		['countyLink3', 'CodeofOrdinanceURL', 14, 'countyLink3b'],
		['countyLink4', 'ZoningURL', 16, 'countyLink4b'],
		['countyLink5', 'CompPlanURL', 19, 'countyLink5b'],
		['countyLink6', 'HazMitPlanURL', 22, 'countyLink6b']
	];
	// for naming and assigning popup content for points
	var popupPointArr = [
		['pointLink1', 'GovtWebURL', 8, 'pointLink1b'],
		['pointLink2', 'WebMapURL', 11, 'pointLink2b'],
		['pointLink3', 'CodeofOrdinanceURL', 14, 'pointLink3b'],
		['pointLink4', 'ZoningURL', 17, 'pointLink4b'],
		['pointLink5', 'CompPlanURL', 20, 'pointLink5b'],
		['pointLink6', 'HazMitPlanURL', 23, 'pointLink6b']
	];
	// for naming and assigning popup content for urban polygons
	var popupPolyArr = [
		['polyLink1', 'GovtWebURL', 8, 'polyLink1b'],
		['polyLink2', 'WebMapURL', 11, 'polyLink2b'],
		['polyLink3', 'CodeofOrdinanceURL', 14, 'polyLink3b'],
		['polyLink4', 'ZoningURL', 17, 'polyLink4b'],
		['polyLink5', 'CompPlanURL', 20, 'polyLink5b'],
		['polyLink6', 'HazMitPlanURL', 23, 'polyLink6b']
	];
	// array that stores colors for map and legend
	var colorPal = [
		["#003744", "bubble01"],
		["#41b6c4", "bubble02"],
		["#a1dab4", "bubble03"],
		["#ffffcc", "bubble04"]
	];
	var clickedCountyName = [];		// stores the last clicked county name
	var clickedUrbanName = [];		// stores the last clicked urban name
	var supSideArr = [
		['firstBox', 'supSideMenu01'],
		['secondBox', 'supSideMenu02'],
		['thirdBox', 'supSideMenu03']
	];
	// stores information for ui functions and features
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
	
	/* initiate basemap */
    var map = new L.Map('map', {
		attributionControl: true, // add attribution to the map
    	zoomControl: true,		  // add zoom control to the map
        center: [44, -84],		  // coordinates of map initation
		minZoom: 6,				  // minimum zoom level of the map
		maxZoom: 13,
		maxBounds: [
			[27, -115], 	  //southwest bounds
			[57, -50]    	  //northeast bounds
		],
        zoom: 6			  // map initiation zoom level
    });
	/* // initiate basemap */
	
	/* initiate url hash */
	var hash = new L.Hash(map);
	/* // initiate url hash */
	

	
	
	/* initiate and declare basemaps */
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
	/* // initiate and declare basemaps */
	
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
	
	/* store and initialize current base layer */
	var currentLayer = "Tile_Layer_1";	// stores our currently visible base map layer
	baseLayers[currentLayer].addTo(map);	// add tiles to map
	/* // store and initialize current base layer */
	
	
	/* initialize and declare layer styles */
	// county style
	var myStyle = {
		fillColor: colorPal[0][0],
		weight: 1,
		opacity: 0.75,
		color: '#fff',
		fillOpacity: 0.75,
		zIndex: 9
	};
	
	// town points style
	var townPointsStyle = {
		radius: 7,
		fillColor: colorPal[2][0],
		color: myPointColor,
		weight: 1,
		opacity: 1,
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// city points style
	var cityPointsStyle = {
		radius: 7,
		fillColor: colorPal[1][0],
		color: myPointColor,
		weight: 1,
		opacity: 1,
		fillOpacity: 0.75,
		zIndex: 20
	};
	
	// village points style
	var villagePointsStyle = {
		radius: 7,
		fillColor: colorPal[3][0],
		color: myPointColor,
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
	/* // initialize and declare layer styles */
	
	
	
	
	/* event listener, fires whenever map zoom is changed */
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
	/* // event listener, fires whenever map zoom is changed */
	
	
	
	
	$.ajax({
		dataType: "json",
		url: "data/greatLakes_urbanPolygons.geojson",
		success: function(data) {
			searchCtrl.indexFeatures(data, ['NAME10', 'NAMELSAD10', 'Name_1']);
			geojson = L.geoJson(data, {
				style: myStyle,
				onEachFeature: onEachFeature,
				filter: function(feature, layer) {
					return feature.properties.COUNTYFP10; //testMAPLE
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
			url: "data/greatLakes_urbanPoints.geojson",
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
	
	$('.leaflet-container').css('cursor', 'crosshair');
	
	
	if ($(window).width() <= 600) {
		windowChange = true;
		isMobile = true;
	} else {
		windowChange = false;
		isMobile = false;
	}
	
	/* handles removing panels if width is below certain amount */
	$(window).resize(function() {
		if ($(window).width() <= 600) {
			if (windowChange == false) {
				// remove all active panels
				searchPage.style.right = "";
				basemapPage.style.right = "";
				filterPage.style.right = "";
				featurePage.style.right = "";
				hoverFeaturePage.style.right = "";
				isMobile = true;
				
				
				if (hasFilter == true) {
					document.getElementById('mobileFilterResetMenu').style.visibility = "visible";
				}
			
				if (clickedCountyName.length != 0 || clickedUrbanName.length != 0) {
					document.getElementById('mobileFeatureMenu').style.visibility = "visible";
				}
				
			}
			windowChange = true;
		} else {
			if (windowChange == true) {
				// remove all active panels
				supMobileMenuWrapper.style.right = "";
				supMobileMenuWrapper.style.visibility = "";
				mobileMenuToggle.innerHTML = "menu";
				isMobile = false;
				document.getElementById('mobileFilterResetMenu').style.visibility = "hidden";
				document.getElementById('mobileFeatureMenu').style.visibility = "hidden";
			}
			windowChange = false;
		}
	});
	/* // handles removing panels if width is below certain amount */
	
	
	
	
	/* define options for fuse search */
	var options = {
		position: 'topleft',
		title: 'Search',
		placeholder: 'Ex: Racine County',
		panelTitle: '',
		maxResultLength: 10,
		showInvisibleFeatures: true,
		caseSensitive: false,
		threshold: 0,
		showResultFct: function (feature, container) {
			props = feature.properties;
			var name = L.DomUtil.create('b', null, container);
			if (props.NAME10 != null) {
				//name.innerHTML = props.NAME10;
				name.innerHTML = props.NAMELSAD10;
				name.setAttribute("id", props.NAME10);
				name.setAttribute("onclick", "myNameSpace.zoomSearchedFeature(this.id, 0)");
				container.appendChild(L.DomUtil.create('br', null, container));
				//container.appendChild(document.createTextNode(props.NAMELSAD10));
			} else if (props.NAME10 == null) {
				//name.innerHTML = props.Name_1;
				name.innerHTML = props.NAMELSAD;
				name.setAttribute("id", props.Name_1);
				name.setAttribute("onclick", "myNameSpace.zoomSearchedFeature(this.id, 1)");
				container.appendChild(L.DomUtil.create('br', null, container));
				//container.appendChild(document.createTextNode(props.NAMELSAD));
			}
		}
	};
	/* // define options for fuse search */
	
	
	/* define and initiate fuse search control */
	var searchCtrl = L.control.fuseSearch(options);
	searchCtrl.addTo(map);
	
	remove = document.getElementById('mySearchPanel'); 
	remove.parentNode.removeChild(remove);
	remove2 = document.getElementById('mySearchContainer');
	remove2.parentNode.removeChild(remove2);
	
	var add = document.getElementById("searchPage");
	add.appendChild(remove);
	/* // define and initiate fuse search control */
	
	/* move the attribution */
	$('.leaflet-control-attribution').detach().appendTo('#infoPage');
	/* // move the attribution */
	
	
	
	
	
	
	/* mouseover feature function */
	function highlightFeature(e) {
		var layer = e.target; // reference layer
		
		if (windowChange == false) {
			if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == colorPal[0][0] && layer.feature.properties.filter == "true") {
				if (clickedCountyName[0] != layer.feature.properties.NAME10) {
					hoverPanel.style.right = "425px";
					crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "hover");
				}
		
				// set new style for hover county polygon
				layer.setStyle({
					fillOpacity: 1,
					zIndex: 11
				});
			
			} else if (layer.feature.geometry.type == 'Point' && layer.feature.properties.filter == "true") {	// here, we can decide if filter is true or false
				if (clickedUrbanName[0] != layer.feature.properties.NAMELSAD) {
					hoverPanel.style.right = "425px";
					crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "hover");
				}	
			
				layer.setStyle({
					weight: 2,
					fillOpacity: 1,
				});
			
			} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != colorPal[0][0] && layer.feature.properties.filter == "true") {
				if (clickedUrbanName[0] != layer.feature.properties.NAMELSAD) {
					hoverPanel.style.right = "425px";
					crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "hover");
				}
			
				layer.setStyle({
					weight: 2,
					fillOpacity: 1
				})
			} else if (layer.feature.properties.filter == "false") {
				
				$('.leaflet-interactive').css('cursor', 'crosshair');
				$('.leaflet-clickable').css('cursor', 'crosshair');
				$('.leaflet-tooltip').css('cursor', 'crosshair');
			}
		}
	};
	/* // mouseover feature function */
	
	
	/* mouseout feature function */
	function resetHighlight(e) {
		if (windowChange == false) {
			hoverPanel.style.right = "";
			if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == colorPal[0][0] && e.target.feature.properties.filter == "true") {
				geojson.eachLayer(function(layer) {
					if (layer.feature.properties.NAME10 != clickedCountyName[0]) {
						if (countyZoomFillControl == false) {
					
							if (layer.feature.properties.filter == "true") {
								layer.setStyle({fillOpacity: 0.75, weight: 1});
							}
						} else if (countyZoomFillControl == true) {
							if (layer.feature.properties.filter == "true") {
								layer.setStyle({fillOpacity: 0.4, weight: 1});
							}
						}
					}
				});
			
			} else if (e.target.feature.geometry.type == 'Point' && e.target.feature.properties.filter == "true") {
				townsPoints.resetStyle(e.target);
				citiesPoints.resetStyle(e.target);
				villagesPoints.resetStyle(e.target);
				
				townsPoints.setStyle({color: myPointColor});
				citiesPoints.setStyle({color: myPointColor});
				villagesPoints.setStyle({color: myPointColor});
		
			} else if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor != colorPal[0][0] && e.target.feature.properties.filter == "true") {
		
				citiesPolygon.eachLayer(function(layer) {
					if (layer.feature.properties.NAMELSAD != clickedUrbanName[0] && layer.feature.properties.filter == "true") {
						layer.setStyle({fillOpacity: 0.75, weight: 1});
					}
				});
				townsPolygon.eachLayer(function(layer) {
					if (layer.feature.properties.NAMELSAD != clickedUrbanName[0] && layer.feature.properties.filter == "true") {
						layer.setStyle({fillOpacity: 0.75, weight: 1});
					}
				});
				villagesPolygon.eachLayer(function(layer) {
					if (layer.feature.properties.NAMELSAD != clickedUrbanName[0] && layer.feature.properties.filter == "true") {
						layer.setStyle({fillOpacity: 0.75, weight: 1});
					}
				});
			
			} else if (e.target.feature.properties.filter == "false") {
				$('.leaflet-interactive').css('cursor', '');
				$('.leaflet-clickable').css('cursor', '');
				$('.leaflet-tooltip').css('cursor', '');
			}
		}
		
	};
	/* // mouseout feature function */
	
	
	/* click feature function */
	function zoomToFeature(e) {
		var clickedBefore = false;
		var layer = e.target; // reference layer
		
		if (clickedBefore == false) {
			if (windowChange == true) {
				if (layer.feature.geometry.type != 'Point') {
					layer.setStyle({fillOpacity: 1, weight: 2});
				}
			}
		
			if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == colorPal[0][0] && layer.feature.properties.filter == "true") {
				if (clickedCountyName[0] != layer.feature.properties.NAME10) {
					var center = layer.getBounds().getCenter();
					removeMarkers();
					countyClickedZoomControl = true;
					clickedCountyName.push(layer.feature.properties.NAME10);
			
			
					map.setView(center, 10);
					crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click"); // call function to cross reference clicked layer name with google spreadsheet data

					window.setTimeout(function() {
						checkFeaturePage("featurePage");
					}, 250);
				} else {
					console.log('already clicked');
				}
			} else if (layer.feature.geometry.type == 'Point' && layer.feature.properties.filter == "true") {
				if (clickedUrbanName[0] != layer.feature.properties.NAMELSAD) {
					var myPointName = layer.feature.properties.NAMELSAD;
					var center = layer._latlng;
					removeMarkers();

					clickedUrbanName.push(layer.feature.properties.NAMELSAD);
			
	
					// find the urban polygon that matches and change it's style to match clicked
					citiesPolygon.eachLayer(function (layer) {
						if (layer.feature.properties.NAMELSAD == myPointName) {
							layer.setStyle({fillOpacity: 1, weight: 2});
						}
					});
					townsPolygon.eachLayer(function (layer) {
						if (layer.feature.properties.NAMELSAD == myPointName) {
							layer.setStyle({fillOpacity: 1, weight: 2});
						}
					});
					villagesPolygon.eachLayer(function (layer) {
						if (layer.feature.properties.NAMELSAD == myPointName) {
							layer.setStyle({fillOpacity: 1, weight: 2});
						}
					});
		
					var marker = L.circleMarker(layer._latlng, {radius: 20, fillOpacity: 0, color: myMarkerColor});
			
					myMarkers.addLayer(marker);
					myMarkers.bringToBack();
					try {
						geojson.bringToBack();
					} catch (err) {
			
					}
			
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
				} else {
					console.log('already clicked');
				}
				
			} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != colorPal[0][0] && layer.feature.properties.filter == "true") {
				if (clickedUrbanName[0] != layer.feature.properties.NAMELSAD) {
					var pointPos;
					var polyName = layer.feature.properties.NAMELSAD;
					var center = layer.getBounds().getCenter();
					map.setView(center, currentZoom);
					//checkFeaturePage("featurePage");
					//clickedUrbanName.length = 0;
					removeMarkers();
					clickedUrbanName.push(layer.feature.properties.NAMELSAD);
		
			
					// need to loop through point layers and find the right point that matches the polygon
					citiesPoints.eachLayer(function (layer) {
						if (polyName == layer.feature.properties.NAMELSAD) {
							pointPos = layer._latlng;
						}
					});
					townsPoints.eachLayer(function (layer) {
						if (polyName == layer.feature.properties.NAMELSAD) {
							pointPos = layer._latlng;
						}
					});
					villagesPoints.eachLayer(function (layer) {
						if (polyName == layer.feature.properties.NAMELSAD) {
							pointPos = layer._latlng;
						}
					});
					var marker = L.circleMarker(pointPos, {radius: 20, fillOpacity: 0, color: myMarkerColor});
					myMarkers.addLayer(marker);
					myMarkers.bringToBack();
					try {
						geojson.bringToBack();
					} catch (err) {
			
					}
					if (checkZoom >= 10 && currentZoom >= 11) {
						myMarkers.setStyle({opacity: 0});
					}
			
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
					//checkFeaturePage("featurePage");
					crossReference(e, layer ,layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click"); // call function to cross reference clicked layer name with google spreadsheet data
					checkFeaturePage("featurePage");
				}
			}
			//firstClick = true;
		}
	};
	/* // click feature function */
	
	
	/* remove markers and reset layers */
	function removeMarkers() {
		
		document.getElementById('mobileFeatureMenu').style.visibility = "hidden";
		myMarkers.clearLayers();
		window.clearInterval(circleInterval);
		countyClickedZoomControl = false;
		if (clickedCountyName.length != 0) {
			geojson.eachLayer(function (layer) {
				if (layer.feature.properties.NAME10 == clickedCountyName[0]) {
					if (countyZoomFillControl == false) {
						if (layer.feature.properties.filter == "true") {
							layer.setStyle({fillOpacity:0.75, weight: 1});
						} else if (layer.feature.properties.filter == "false") {
							layer.setStyle({fillOpacity:0, weight: 0, opacity: 0});
						}
					} else if (countyZoomFillControl == true) {
						
						if (layer.feature.properties.filter == "true") {
							layer.setStyle({fillOpacity:0.4, weight: 1});
						} else if (layer.feature.properties.filter == "false") {
							layer.setStyle({fillOpacity:0, weight: 0, opacity: 0});
						}
					}
				}
			});
		}
		clickedCountyName.length = 0;
		
		if (clickedUrbanName.length != 0 ) {
			// maybe check here for LSAD and see if it's city, village, or town to save computation power
			citiesPolygon.eachLayer(function (layer) {
				if (layer.feature.properties.NAMELSAD == clickedUrbanName[0]) {
					if (layer.feature.properties.filter == "true") {
						layer.setStyle({fillOpacity: 0.75, weight: 1});
					} else if (layer.feature.properties.filter == "false") {
						layer.setStyle({fillOpacity: 0, weight: 0, opacity: 0});
					}
				}
			});
			
			townsPolygon.eachLayer(function (layer) {
				if (layer.feature.properties.NAMELSAD == clickedUrbanName[0]) {
					if (layer.feature.properties.filter == "true") {
						layer.setStyle({fillOpacity: 0.75, weight: 1});
					} else if (layer.feature.properties.filter == "false") {
						layer.setStyle({fillOpacity: 0, weight: 0, opacity: 0});
					}
				}
			});
			
			villagesPolygon.eachLayer(function (layer) {
				if (layer.feature.properties.NAMELSAD == clickedUrbanName[0]) {
					if (layer.feature.properties.filter == "true") {
						layer.setStyle({fillOpacity: 0.75, weight: 1});
					} else if (layer.feature.properties.filter == "false") {
						layer.setStyle({fillOpacity: 0, weight: 0, opacity: 0});
					}
				}
			});
		}
		clickedUrbanName.length = 0;
	};
	/* // remove markers and reset layers */
	
	
	
	/* add event listeners */
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature, // call highlightFeature function on mouseover
			mouseout: resetHighlight,	 // call resetHighlight function on mouseout
			click: zoomToFeature		 // call zoomToFeature function on click
		});
		
		feature.layer = layer;
	};
	/* // add event listeners */
	
	
	

	/* function to cross reference name of county polygon with google spreadsheet */
	function crossReference(e, layer, props, type, color, clickHov) {
		var featureColor = color;
		if (type == 'MultiPolygon' && color == colorPal[0][0]) {
			var target = props.GEOID; // reference
			var name = props.NAME10;
			if (clickHov == "click") {
				removePanelInfo("click");
			} else if (clickHov == "hover") {
				removePanelInfo("hover");
			}
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			var ggleSprd = googleSpreadsheet.length;
			for (i=0; i < ggleSprd; i++) {
				if (target == googleSpreadsheet[i][2]) { 
					addCountyPanelInfo(name, i, clickHov);
				}
			}
			
		} else if (type == 'Point') {
			var target = props.GEOID;
			var name = props.name;
			
			var target2 = props.GEOID;
			var name2 = props.NAMELSAD;
			
			if (clickHov == "click") {
				removePanelInfo("click");
			} else if (clickHov == "hover") {
				removePanelInfo("hover");
			}
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			var gglSprd2 = googleSpreadsheet2.length;
			for (i=0; i < gglSprd2; i++) {
				if (target2 == googleSpreadsheet2[i][2]) {
					addUrbanPanelInfo(name, i, clickHov, featureColor);
				}
			}
		} else if (type == 'MultiPolygon' && color != colorPal[0][0]) {
			var target = props.GEOID;
			var name = props.Name_1;
			
			var target2 = props.GEOID;
			var name2 = props.NAMELSAD;
			
			if (clickHov == "click") {
				removePanelInfo("click");
			} else if (clickHov == "hover") {
				removePanelInfo("hover");
			}
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			var gglSprd2 = googleSpreadsheet2.length;
			for (i=0; i < gglSprd2; i++) {
				if (target2 == googleSpreadsheet2[i][2]) {
					addUrbanPanelInfo(name, i, clickHov, featureColor);
				}
			}
		}
	};
	/* // function to cross reference name of county polygon with google spreadsheet */
	
	
	
	
	
	/* checks whether to add points or polygons to the map based on zoom */
	function updateZoom() {
		var pntA = pointArray.length;
		var plyA = polygonArray.length;
		if (checkZoom <= 11 && currentZoom <= 10) {
			
			if (pointZoomC == true) {
				var i;
				for(i=0; i < pntA; i++) {
					map.addLayer(pointArray[i]);
					myMarkers.setStyle({opacity: 1});
				}
				
				if (hasFilter == true) {
					
					testFilter();
				} else if (hasFilter == false) {
					
					resetFilter();
				}
				
				var j;
				for (j=0; j < plyA; j++) {
					map.removeLayer(polygonArray[j]);
				}
			
				countyZoomFillControl = false;
				
				if (countyClickedZoomControl == true) {
					geojson.eachLayer(function (layer) {
						if (hasFilter == false) {
							if (clickedCountyName[0] != layer.feature.properties.NAME10) {
								layer.setStyle({fillOpacity:0.75});
							}
						}
					});
				} else if (countyClickedZoomControl == false) {
					if (hasFilter == false) {
						try {
							geojson.setStyle({fillOpacity:0.75});
						}
						catch (err) {
							
						}
					}
				}
			
				pointZoomC = false;
				polyZoomC = true;
				
			}
		} else if (checkZoom >= 10 && currentZoom >= 11) {
			
			if (polyZoomC == true) {
				var i;
				for(i=0; i < pntA; i++) {
					map.removeLayer(pointArray[i]);
					myMarkers.setStyle({opacity: 0});
				}
				
				var j;
				for (j=0; j < plyA; j++) {
					map.addLayer(polygonArray[j]);
				}
				
				if (hasFilter == true) {
					testFilter();
				} else if (hasFilter == false) {
					resetFilter();
				}
			
				countyZoomFillControl = true;
		
				if (countyClickedZoomControl == true) {
					geojson.eachLayer(function (layer) {
						if (hasFilter == false) {
							if (clickedCountyName[0] != layer.feature.properties.NAME10) {
								layer.setStyle({fillOpacity:0.4});
							}
						}
						
					});
				} else if (countyClickedZoomControl == false) {
					if (hasFilter == false) {
						geojson.setStyle({fillOpacity:0.4});
					}
					
				}	
			
				polyZoomC = false;
				pointZoomC = true;
			}
		}
	};
	/* // checks whether to add points or polygons to the map based on zoom */
	
	
	
	
	
	
	
	
	function toggle(source, x) {
		if (x == 0) {
			// remove layer
			if (source == "bubble01") {
				map.removeLayer(geojson);
				myMarkerColor = "black";
				myPointColor = "black";
				try {
					myMarkers.setStyle({color: myMarkerColor});
				} catch (err) {
					
				}
				try {
					townsPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
				try {
					citiesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				} try {
					villagesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
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
				myMarkerColor = "white";
				myPointColor = "white";
				
				try {
					myMarkers.setStyle({color: myMarkerColor});
				} catch (err) {
					
				}
				try {
					townsPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
				try {
					citiesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				} try {
					villagesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
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

	
	

	/* handles changing of the base map */
	function changeBaseMap(source) {
		map.removeLayer(baseLayers[currentLayer]);
		currentLayer = source;
		baseLayers[source].addTo(map);
		
		var image = document.getElementById(source);
		var active = image.classList.contains('active');
		
		if (isMobile == true) {
			uiHover("basemapPageToggle", 3);
			//showMobileMenu("mobileMenu");
			hideMobileMenu("mobileMenu");
		}
	};
	/* // handles changing of the base map */
	
	
	
	
	
	/* handles filtering the features */
	function testFilter() {
		hashFilterVar = "two";
		L.Hash.formatHash(map, hashFilterVar);
		resetFilter();
		document.getElementById('thirdCircle').classList.add('filterActive');
		document.getElementById('thirdCircle').style.opacity = "1";
		hasFilter = true;
		document.getElementById('mobileFilterResetMenu').style.visibility = "visible";
		var index;	// urban
		var index2; // counties
		var row;	// points
		var row2;	// urban polys
		var row3;	// counties
		var theLayer;	// points
		var theSecondLayer;	// urban polys
		var theThirdLayer;	// counties
		var ppupPnt = popupPointArr.length;
		var gglSprd2 = googleSpreadsheet2.length;
		var ppupCnty = popupCountyArr.length;
		var gglSprd = googleSpreadsheet.length;
		
		
		// first, loop through each item in currentCheckArr (which holds the attributes we're filtering)
		var i;
		var ccChk = currentCheckArr.length;
	
		for (i=0; i < ccChk; i++) {
			var attribute = currentCheckArr[i];
			
			// second, loop through popupPointArr to match the attribute with the corresponding google spreadsheet row
			var z;
			for (z=0; z < ppupPnt; z++) {
				if (attribute == popupPointArr[z][1]) {
					index = z;
				}
			}
			
			// included with second, loop through county arr to match the attribute with the corresponding county google spreadsheet row
			var r;
			for (r=0; r < ppupCnty; r++) {
				if (attribute == popupCountyArr[r][1]) {
					index2 = r;
				} else {
				
				}
			}
			
			// third, determine which layers were selected
			var g;
			if (currentSelectArr[0] == "All") {
				var currSltA = allSelectArr.length;
				var currSlt = allSelectArr;
				myMarkerColor = "black";
				myPointColor = "black";
				try {
					myMarkers.setStyle({color: myMarkerColor});
				} catch (err) {
					
				}
				try {
					townsPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
				try {
					citiesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
				try {
					villagesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
			} else if (currentSelectArr[0] == "Cities, Villages, Towns") {
				var currSltA = urbanSelectArr.length;
				var currSlt = urbanSelectArr;
				myMarkerColor = "black";
				myPointColor = "black";
				try {
					myMarkers.setStyle({color: myMarkerColor});
				} catch (err) {
					
				}
				try {
					townsPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
				try {
					citiesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
				try {
					villagesPoints.setStyle({color: myPointColor});
				} catch (err) {
					
				}
			} else if (currentSelectArr[0] == "Counties") {
				var currSltA = countySelectArr.length;
				var currSlt = countySelectArr;
			}
			for (g=0; g < currSltA; g++) {
				if (currSlt[g] == "Towns") {
					theLayer = townsPoints;
					theSecondLayer = townsPolygon;
				} else if (currSlt[g] == "Cities") {
					theLayer = citiesPoints;
					theSecondLayer = citiesPolygon;
				} else if (currSlt[g] == "Villages") {
					theLayer = villagesPoints;
					theSecondLayer = villagesPolygon;
				} else if (currSlt[g] == "Counties") {
					theThirdLayer = geojson;
				}
				
				try {
					// fourth, loop through the selected layer
					theLayer.eachLayer(function (layer) {
						var name = layer.feature.properties.NAMELSAD;
						var theID = layer.feature.properties.GEOID;
						//fifth, find the match row on the google spreadsheet
						var m;
						for (m=0; m < gglSprd2; m++) {
							if (theID == googleSpreadsheet2[m][2]) {
								var row = m;		// match row is found
							}
						}
					
						// sixth, check if attribute is null or not
						if (googleSpreadsheet2[row][popupPointArr[index][2]] == 'null') {
						
							// add to array false
							try {
								layer.feature.properties.filter = "false";
								layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
								layer.bringToBack();
							} catch (err) {
							
							}
						} else if (googleSpreadsheet2[row][popupPointArr[index][2]] != 'null') {
						
							try {
								// add to array true
								if (layer.feature.properties.filter == "false") {
									layer.feature.properties.filter = "false";
								} else {
							
									layer.feature.properties.filter = "true";
								}
							} catch (err) {
							
							}
						}
					});
				} catch (err) {
					
				}
				
				// fourth (b) loop through the selected polygon layer
				try {
					theSecondLayer.eachLayer(function (layer) {
						var name = layer.feature.properties.NAMELSAD;
						var theID = layer.feature.properties.GEOID;
						// fifth (b), find the match row on the google spreadsheet
						var m;
						for (m=0; m < gglSprd2; m++) {
							if (theID == googleSpreadsheet2[m][2]) {
								var row2 = m;
							}
						}
					
						// sixth (b), check if attribute is null or not
						if (googleSpreadsheet2[row2][popupPointArr[index][2]] == 'null') {
						
							try {
								// add to array false
								layer.feature.properties.filter = "false";
		
								layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
								layer.bringToBack();
							} catch (err) {
							
							}
						} else if (googleSpreadsheet2[row2][popupPointArr[index][2]] != 'null') {
						
							try {
								// add to array true
								if (layer.feature.properties.filter == "false") {
									layer.feature.properties.filter = "false";
								} else {
						
									layer.feature.properties.filter = "true";
								}
							} catch (err) {
							
							}
						}
					});
				} catch (err) {
					
				}
				
				// fourth (c) loop through the county layer
				try {
					theThirdLayer.eachLayer(function (layer) {
						var name = layer.feature.properties.NAME10;
						var theID = layer.feature.properties.GEOID;
						// fifth (b), find the match row on the google spreadsheet
						var m;
						for (m=0; m < gglSprd; m++) {
							if (theID == googleSpreadsheet[m][2]) {
								var row3 = m;
							}
						}
						// sixth (c), check if attribute is null or not
						if (googleSpreadsheet[row3][popupCountyArr[index2][2]] == 'null') {
							try {
								// add to array false
								layer.feature.properties.filter = "false";
								layer.setStyle({opacity: '0', fillOpacity: '0'});
								layer.bringToBack();
							} catch (err) {
								
							}
						} else if (googleSpreadsheet[row3][popupCountyArr[index2][2]] != 'null') {
							try {
								// add to array true
								if (layer.feature.properties.filter == "false") {
									layer.feature.properties.filter = "false";
								} else {
									layer.feature.properties.filter = "true";
								}
							} catch (err) {
								
							}
						}
					});
				} catch (err) {
					
				}
				
				// seventh, for the layers that were not selected for filtering, remove
				if (currSlt.indexOf("Towns") == -1) {
					try {
						// remove all towns, treat as null
						townsPoints.eachLayer(function (layer) {
						
							layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
							layer.bringToBack();
					
							layer.feature.properties.filter = "false";
						});
					} catch (err) {
						
					}
					
					try {
						townsPolygon.eachLayer(function (layer) {
						
							layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
							layer.bringToBack();
						
							layer.feature.properties.filter = "false";
						
						
						});
					} catch (err) {
						
					}	
				}
				
				if (currSlt.indexOf("Cities") == -1) {
					try {
						// remove all cities, treat as null
						citiesPoints.eachLayer(function (layer) {
							layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
							layer.bringToBack();
						
							layer.feature.properties.filter = "false";
						});
					} catch (err) {
						
					}
					
					try {
						citiesPolygon.eachLayer(function (layer) {
							layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
							layer.bringToBack();
						
							layer.feature.properties.filter = "false";
						});
					} catch (err) {
						
					}
				}
				
				if (currSlt.indexOf("Villages") == -1) {
					try {
						// remove all vilages, treat as null
						villagesPoints.eachLayer(function (layer) {
							layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
							layer.bringToBack();
						
							layer.feature.properties.filter = "false";
						});
					} catch (err) {
						
					}
					
					try {
						villagesPolygon.eachLayer(function (layer) {
							layer.setStyle({opacity: '0', fillOpacity: '0', zIndex: '-10000'});
							layer.bringToBack();
						
							layer.feature.properties.filter = "false";
						});
					} catch (err) {
						
					}
				}
				
				if (currSlt.indexOf("Counties") == -1) {
					try {
						// remove all counties, treat as null
						geojson.eachLayer(function (layer) {
							layer.setStyle({opacity: '0', fillOpacity: '0'});
							layer.bringToBack();
							layer.feature.properties.filter = "false";
						});
					} catch (err) {
						
					}
				}
			}
		}
		
		if (isMobile == true) {
			uiHover("filterPageToggle", 3);
			//howMobileMenu("mobileMenu");
			hideMobileMenu("mobileMenu");
		}
	};
	/* // handles filtering the features */
	
	
	/* handles reseting the filtering */
	function resetFilter() {
		hasFilter = false;
		document.getElementById('mobileFilterResetMenu').style.visibility = "hidden";
		document.getElementById('thirdCircle').classList.remove('filterActive');
		document.getElementById('thirdCircle').style.opacity = ".7";
		
		var isCountyIn = map.hasLayer(geojson);
		if (isCountyIn == true) {
			myMarkerColor = "white";
			myPointColor = "white";
		} else if (isCountyIn == false) {
			myMarkerColor = "white";
			myPointColor = "white";
		}
		
		try {
			myMarkers.setStyle({color: myMarkerColor});
		} catch (err) {
			
		}
		try {
			townsPoints.setStyle({color: myPointColor});
		} catch (err) {
					
		}
		try {
			citiesPoints.setStyle({color: myPointColor});
		} catch (err) {
					
		}
		try {
			villagesPoints.setStyle({color: myPointColor});
		} catch (err) {
					
		}
		
		try {
			geojson.eachLayer(function (layer) {
				if (clickedCountyName != layer.feature.properties.NAME10) {
					if (currentZoom >= 11) {
						layer.setStyle({opacity: '1', fillOpacity: '0.4'});
					} else {
						layer.setStyle({opacity: '1', fillOpacity: '0.75'});
					}
					
					//layer.bringToFront(); experimental
					layer.feature.properties.filter = "true";
				}
			});
		} catch (err) {
			
		}
		
		try {
			townsPoints.eachLayer(function (layer) {
				layer.setStyle({opacity: '1', fillOpacity: '0.75', zIndex: '20'});
				layer.bringToFront();
				layer.feature.properties.filter = "true";
			});
			citiesPoints.eachLayer(function (layer) {
				layer.setStyle({opacity: '1', fillOpacity: '0.75', zIndex: '20'});
				layer.bringToFront();
				layer.feature.properties.filter = "true";
			});
			villagesPoints.eachLayer(function (layer) {
				layer.setStyle({opacity: '1', fillOpacity: '0.75', zIndex: '20'});
				layer.bringToFront();
				layer.feature.properties.filter = "true";
			});
		} catch (err) {
			
		}
		
		try {
			townsPolygon.eachLayer(function (layer) {
				if (clickedUrbanName != layer.feature.properties.NAMELSAD) {
					layer.setStyle({opacity: '1', fillOpacity: '0.75', zIndex: '20'});
					layer.bringToFront();
					layer.feature.properties.filter = "true";
				}
			});
			citiesPolygon.eachLayer(function (layer) {
				if (clickedUrbanName != layer.feature.properties.NAMELSAD) {
					layer.setStyle({opacity: '1', fillOpacity: '0.75', zIndex: '20'});
					layer.bringToFront();
					layer.feature.properties.filter = "true";
				}
			});
			villagesPolygon.eachLayer(function (layer) {
				if (clickedUrbanName != layer.feature.properties.NAMELSAD) {
					layer.setStyle({opacity: '1', fillOpacity: '0.75', zIndex: '20'});
					layer.bringToFront();
					layer.feature.properties.filter = "true";
				}
			});
		} catch (err) {
		
		}
	};
	/* // handles reseting the filtering */
	
	
	
	/* handles zooming to the searched feature */
	function zoomSearchedFeature(source, num) {
		if (num == 0) {
			geojson.eachLayer(function (layer) {		// go through each layer in county geojson
				var name = layer.feature.properties.NAME10;	// store the name of the layer
			
				if (name == source) {		// of the layer's name equals the clicked sources name
					geojson.eachLayer(function (layer) {
						if (name == layer.feature.properties.NAME10) {
							removeMarkers();
							if (hasFilter == true) {
								if (layer.feature.properties.filter == "false") {
									holdZoom(source, num);
								} else {
									countyClickedZoomControl = true;
									clickedCountyName.push(layer.feature.properties.NAME10);
									layer.setStyle({fillOpacity: '1'});
									var center = layer.getBounds().getCenter();
									map.setView(center, 10);
									checkFeaturePage("featurePage");
									crossReference(null, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click");
								}
							} else {
								countyClickedZoomControl = true;
								clickedCountyName.push(layer.feature.properties.NAME10);
								layer.setStyle({fillOpacity: '1'});
								var center = layer.getBounds().getCenter();
								map.setView(center, 10);
								checkFeaturePage("featurePage");
								crossReference(null, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click");
							}
						}
					});
				}
			});
		} else if (num == 1) {
			// this could maybe be fixed here
			townsPoints.eachLayer(function (layer) {
				var name = layer.feature.properties.name;
				
				if (name == source) {
					urbanSearch(layer);
				}
			});
			
			citiesPoints.eachLayer(function (layer) {
				var name = layer.feature.properties.name;
				
				if (name == source) {
					urbanSearch(layer);
				}
			});
			
			villagesPoints.eachLayer(function (layer) {
				var name = layer.feature.properties.name;
				
				if (name == source) {
					urbanSearch(layer);
				}
			});
		}
		
		function urbanSearch(layer) {
			var myPointName = layer.feature.properties.NAMELSAD;
			var center = layer._latlng;
			removeMarkers();
			if (hasFilter == true) {
				if (layer.feature.properties.filter == "false") {
					holdZoom(source, num);
				} else {
					runUrbanQuery(layer);
				}
			} else {
				runUrbanQuery(layer);
			}
			
			function runUrbanQuery(layer) {
				// find the urban polygon that matches and change it's style to match clicked
				citiesPolygon.eachLayer(function (layer) {
					if (layer.feature.properties.NAMELSAD == myPointName) {
						if (hasFilter == true) {
							if (layer.feature.properties.filter == "false") {
								holdZoom(source, num);
							} else {
								addNeccessaryStyles(layer);
							}
						} else {
							addNeccessaryStyles(layer);
						}
					}
				});
				
				townsPolygon.eachLayer(function (layer) {
					if (layer.feature.properties.NAMELSAD == myPointName) {
						if (hasFilter == true) {
							if (layer.feature.properties.filter == "false") {
								holdZoom(source, num);
							} else {
								addNeccessaryStyles(layer);
							}
						} else {
							addNeccessaryStyles(layer);
						}
					}
				});
				
				villagesPolygon.eachLayer(function (layer) {
					if (layer.feature.properties.NAMELSAD == myPointName) {
						if (hasFilter == true) {
							if (layer.feature.properties.filter == "false") {
								holdZoom(source, num);
							} else {
								addNeccessaryStyles(layer);
							}
						} else {
							addNeccessaryStyles(layer);
						}
					}
				});
				
				function addNeccessaryStyles(layer) {
					clickedUrbanName.push(layer.feature.properties.NAMELSAD);
					layer.setStyle({fillOpacity: 1, weight: 2});
					
					// add animated point
					var marker = L.circleMarker(center, {radius: 20, fillOpacity: 0, color: myMarkerColor});
					myMarkers.addLayer(marker);
					myMarkers.bringToFront(); // experimental
					try {
						geojson.bringToBack();
					}
					catch (err) {
						
					}
					
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
					
					// center on point
					if (currentZoom >= 11) {
						// set view to polygon bounds
						myMarkers.setStyle({opacity: 0});
						map.setView(center, 11);
					} else if (currentZoom < 11) {
						map.setView(center, 10);
					}
					
					// crossreference
					crossReference(null, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor, "click");
					
					// checkfeaturepage
					checkFeaturePage('featurePage');
				};
			};
		};
		
		if (isMobile == true) {
			uiHover("searchPageToggle", 3);
			//showMobileMenu("mobileMenu");
			hideMobileMenu("mobileMenu");
		}
	};
	/* // handles zooming to the searched feature */
	
	
	
	
	/* handles accepting reset of filter after a search */
	function searchCheckToggle(num) {
		document.getElementById("searchCheck").style.visibility = "hidden";
		if (num == 0) {
			resetFilter();
			zoomSearchedFeature(holdZoomSource, holdZoomNum);
		} else if (num == 1) {
			
		}
	};
	
	function holdZoom(source, num) {
		document.getElementById('searchCheck').style.visibility = "visible";
		holdZoomSource = source;
		holdZoomNum = num;
	};
	/* // handles accepting reset of filter after a search */
	
	
	
	
	/* handles storing filter attribute options */
	function storeChecks(source, myId) {
		var isThere = currentCheckArr.indexOf(source);
		var clicked = document.getElementById(myId);
		
		if (isThere == -1) {
			currentCheckArr.push(source);
			
			clicked.classList.add('myCheckBoxActive');
		} else if (isThere >= 0) {
			currentCheckArr.splice(isThere, 1);
			clicked.classList.remove('myCheckBoxActive');
		}
	};
	/* // handles storing filter attribute options */
	
	
	
	
	/* handles hovering filter buttons */
	function hoverChecks(source, num) {
		var theBox = document.getElementById(source);
		var isActive = theBox.classList.contains('myCheckBoxActive');
		if (num == 0) {
			if (isActive == true) {
				// do nothing
			} else if (isActive == false) {
				theBox.classList.add('myCheckBoxHover');
			}
		} else if (num == 1) {
			if (isActive == true) {
				// do nothing
			} else if (isActive == false) {
				theBox.classList.remove('myCheckBoxHover');
			}
		}
	};
	/* // handles hovering filter buttons */
	
	
	
	
	/* handles initiating event listener for layer filter selection */
	function listenToMyForm() {
		$('.mySelections').on('change', function(){
			currentSelectArr.length = 0;
			var selected = $(this).find("option:selected").val();
			currentSelectArr.push(selected);
		});
	};
	/* // handles initiating event listener for layer filter selection */
	
	
	
	
	/* handles giving features their color */
	function initiateMapColors() {
		// initiate colors for legend
		document.getElementById(colorPal[0][1]).style.background = colorPal[0][0];
		document.getElementById(colorPal[1][1]).style.background = colorPal[1][0];
		document.getElementById(colorPal[2][1]).style.background = colorPal[2][0];
		document.getElementById(colorPal[3][1]).style.background = colorPal[3][0];
	};
	/* // handles giving features their color */
	
	
	
	/* load sheets API client library */
	function loadSheetsApi() {
		var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
		gapi.client.load(discoveryUrl).then(listMajors);
	};
	/* // load sheets API client library */
	
	

	
	// https://docs.google.com/spreadsheets/d/1JMq9zVGVeMIHE5Bj10ngnGFag3glNUV71yKYk4iyjmw/edit#gid=0  = old spreadsheet
	// https://docs.google.com/spreadsheets/d/1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA/edit#gid=0  = new spreadsheet
	// https://docs.google.com/spreadsheets/d/1Yk17OmtUcr9wHYdi-R4Rfu-T4SP3FEwh9TJw42FNnvQ/edit?ts=58f4fb6f#gid=0 = final spreadsheet (david owns) (needs setup)
	// here's the API key for final spreadsheet = AIzaSyCMqrrydnFu4PASIznyL2eCZQ99koTYZ4Q
	/* store data from spreadsheet */
	function listMajors() {
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1Yk17OmtUcr9wHYdi-R4Rfu-T4SP3FEwh9TJw42FNnvQ',
			range: 'Counties!A2:Y',
			key: 'AIzaSyCMqrrydnFu4PASIznyL2eCZQ99koTYZ4Q',
		}).then(function(response) {
			var range = response.result;
			if (range.values.length > 0) {
				for (i=0; i < range.values.length; i++) {
					var row = range.values[i];
					var arr = [row[0], row[1], row[2], row[6], row[7], row[8], row[11], row[14], row[16], row[19], row[22]];
					// row[0]=NAME, row[1]=NAMELSAD, row[2]=GEOID, row[6]=POP2000, row[7]=POP2010, row[8]=GovtWebURL, row[11]=WebMapURL, row[14]=CodeofOrdinanceURL, row[16]=ZoningURL, row[19]=CompPlanURL, row[22]=HazMitPlanURL
					googleSpreadsheet.push(arr);
				}
			} else {
				console.log('No data found.');
			}
		}, function (response) {
			console.log('Error: ' + response.result.error.message);
		});
		
		/*
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA', 	// can be found from link inside (or above)
			range: 'Sheet1!A2:BK', 										   	// get data from Sheet1, and from columns A through BK, starting at row 2
			// =SUM(page1!b100; page2!b100; page3!b100; page4!b100; page5!b100; page6!b100; page7!b100;)
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
					var arr = [row[0], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]];
					googleSpreadsheet2.push(arr);	// send data to googleSpreadsheet array
				}
			} else {
				console.log('No data found.');
			}
		}, function (response) {
			console.log('Error: ' + response.result.error.message);
		});
		*/
		
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1Yk17OmtUcr9wHYdi-R4Rfu-T4SP3FEwh9TJw42FNnvQ',
			range: 'Cities!A2:Z; Villages!A2:Z; Boroughs!A2:Z; Indian Reservations!A2:Z; Towns!A2:Z; Townships!A2:Z'
			key: 'AIzaSyCMqrrydnFu4PASIznyL2eCZQ99koTYZ4Q',
		}).then(function(response) {
			var range = response.results;
			if (range.values.length > 0) {
				for (i=0; i < range.values.length; i++) {
					var row = range.values[i];
					var arr = [row[0], row[1], row[2], row[6], row[7], row[8], row[11], row[14], row[17], row[20], row[23]];
					// row[0]=NAME, row[1]=NAMELSAD, row[2]=GEOID, row[6]=POP2000, row[7]=POP2010, row[8]=GovtWebURL, row[11]=WebMapURL, row[14]=CodeofOrdinanceURL, row[17]=ZoningURL, row[20]=CompPlanURL, row[23]=HazMitPlanURL
					googleSpreadsheet2.push(arr);
				}
			} else {
				console.log('No data found.');
			}
		}, function (response) {
			console.log('Error: ' + response.result.error.message);
		});
	};
	/* // store data from spreadsheet */
	
	
	
	
	

	/* handles toggling the visibility of layers */
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
	/* // handles toggling the visibility of layers */
	
	
	
	
	
	/* handles displaying a part of side menu */
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
	/* // handles displaying a part of side menu */
	
	
	
	/* handles multiple ui hover and click functions */
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
			box.style.left = "-255px";
		} else if (num == 0) {
			// out, remove box
			var circleActive = circle.classList.contains('filterActive');
			if (circleActive == true) {
				box.style.left = "";
			} else {
				circle.style.opacity = "";
				box.style.left = "";
			}
		} else if (num == 2) {
			var active = circleCross.classList.contains("active");
			if (active == true) {
				circleCross.style.right = "";
				circleCross.classList.remove("active");
			} else if (active == false) {
				var x = window.innerWidth;
				if (x <= 600) {
					circleCross.style.right = "100%";
				} else if (x > 600) {
					circleCross.style.right = "425px";
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
			//hoverControl = false;
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
	/* // handles multiple ui hover and click functions */
	
	
	
	/* handles reseting feature page */
	function checkFeaturePage(source) {
		var page = document.getElementById("featurePage");
		var active = page.classList.contains('active');
	
		if (active == false) {
			var x = window.innerWidth;
		
			if (x <= 600) {
				
				page.style.right = "100%";
			} else if (x > 600) {
				page.style.right = "425px";
			}
			page.classList.add("active");
		} else if (active == true) {
			// do nothing
		}
	};
	/* // handles reseting feature page */

	
	
	/* handles displaying the mobile menu */
	function showMobileMenu(source) {
		var button = document.getElementById(source);
		var page = document.getElementById("supMobileMenuWrapper");
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
	
	function hideMobileMenu(source) {
		var button = document.getElementById(source);
		var page = document.getElementById("supMobileMenuWrapper");
		var active = button.classList.contains('active');
		if (active == true) {
			page.style.right = "";
			window.setTimeout(function(){ page.style.visibility = "hidden";}, 250);
			button.classList.remove('active');
			var toggle = document.getElementById('mobileMenuToggle');
			toggle.innerHTML = "menu";
		}
	}
	/* // handles displaying the mobile menu */
	
	
	
	/* handles clicking mobile menu functions */
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
		
		name.style.right = "100%";
	};
	/* // handles clicking mobile menu functions */
	
	
	
	/* handles adding information for county features */
	function addCountyPanelInfo(target, i, clickHov) {
		
		if (clickHov == "click") {
			var title = document.getElementById("featurePageName");
			var page = document.getElementById('featurePage');
			var pop2000 = document.getElementById("featurePop2000");
			var pop2010 = document.getElementById("featurePop2010");
			var removeClass = "gonnaRemoveClick";
			var link1Attr = popupCountyArr[0][0];
			var link2Attr = popupCountyArr[1][0];
			var link3Attr = popupCountyArr[2][0];
			var link4Attr = popupCountyArr[3][0];
			var link5Attr = popupCountyArr[4][0];
			var link6Attr = popupCountyArr[5][0];
			/*var link7Attr = popupCountyArr[6][0];
			var link8Attr = popupCountyArr[7][0];
			var link9Attr = popupCountyArr[8][0];*/
		} else if (clickHov == "hover") {
			var title = document.getElementById("hoverFeaturePageName");
			var page = document.getElementById("hoverFeaturePage");
			var pop2000 = document.getElementById("hoverFeaturePop2000");
			var pop2010 = document.getElementById("hoverFeaturePop2010");
			var removeClass = "gonnaRemoveHover";
			var link1Attr = popupCountyArr[0][3];
			var link2Attr = popupCountyArr[1][3];
			var link3Attr = popupCountyArr[2][3];
			var link4Attr = popupCountyArr[3][3];
			var link5Attr = popupCountyArr[4][3];
			var link6Attr = popupCountyArr[5][3];
			/*var link7Attr = popupCountyArr[6][3];
			var link8Attr = popupCountyArr[7][3];
			var link9Attr = popupCountyArr[8][3];*/
		}
		
		title.innerHTML = target + " County";
		
		pop2000.innerHTML = "Population 2000: " + googleSpreadsheet[i][1];
		
		pop2010.innerHTML = "Population 2010: " + googleSpreadsheet[i][2];
					
		var link1 = document.createElement("a");
		var link2 = document.createElement("a");
		var link3 = document.createElement("a");
		var link4 = document.createElement("a");
		var link5 = document.createElement("a");
		var link6 = document.createElement("a");
		/*var link7 = document.createElement("a");
		var link8 = document.createElement("a");
		var link9 = document.createElement("a");*/
					
		var text1 = document.createTextNode("GovtWebURL");
		var text2 = document.createTextNode("WebMapURL");
		var text3 = document.createTextNode("CodeofOrdinanceURL");
		var text4 = document.createTextNode("ZoningURL");
		var text5 = document.createTextNode("CompPlanURL");
		var text6 = document.createTextNode("HazMitPlanURL");
		/*var text7 = document.createTextNode("Climate Plan");
		var text8 = document.createTextNode("Resilience Plan");
		var text9 = document.createTextNode("Zoning Code")*/
					
		link1.appendChild(text1);
		link2.appendChild(text2);
		link3.appendChild(text3);
		link4.appendChild(text4);
		link5.appendChild(text5);
		link6.appendChild(text6);
		/*link7.appendChild(text7);
		link8.appendChild(text8);
		link9.appendChild(text9);*/
					
		link1.setAttribute("id", link1Attr);
		link2.setAttribute("id", link2Attr);
		link3.setAttribute("id", link3Attr);
		link4.setAttribute("id", link4Attr);
		link5.setAttribute("id", link5Attr);
		link6.setAttribute("id", link6Attr);
		/*link7.setAttribute("id", link7Attr);
		link8.setAttribute("id", link8Attr);
		link9.setAttribute("id", link9Attr);*/
					
		link1.setAttribute("target", "_blank");
		link2.setAttribute("target", "_blank");
		link3.setAttribute("target", "_blank");
		link4.setAttribute("target", "_blank");
		link5.setAttribute("target", "_blank");
		link6.setAttribute("target", "_blank");
		/*link7.setAttribute("target", "_blank");
		link8.setAttribute("target", "_blank");
		link9.setAttribute("target", "_blank");*/
					
		link1.setAttribute("class", removeClass);
		link2.setAttribute("class", removeClass);
		link3.setAttribute("class", removeClass);
		link4.setAttribute("class", removeClass);
		link5.setAttribute("class", removeClass);
		link6.setAttribute("class", removeClass);
		/*link7.setAttribute("class", removeClass);
		link8.setAttribute("class", removeClass);
		link9.setAttribute("class", removeClass);*/
					
		var break1 = document.createElement("br");
		var break2 = document.createElement("br");
		var break3 = document.createElement("br");
		var break4 = document.createElement("br");
		var break5 = document.createElement("br");
		var break6 = document.createElement("br");
		/*var break7 = document.createElement("br");
		var break8 = document.createElement("br");
		var break9 = document.createElement("br");*/
					
		break1.setAttribute('id', 'break1');
		break2.setAttribute('id', 'break2');
		break3.setAttribute('id', 'break3');
		break4.setAttribute('id', 'break4');
		break5.setAttribute('id', 'break5');
		break6.setAttribute('id', 'break6');
		/*break7.setAttribute('id', 'break7');
		break8.setAttribute('id', 'break8');
		break9.setAttribute('id', 'break9');*/
					
		break1.setAttribute("class", removeClass);
		break2.setAttribute("class", removeClass);
		break3.setAttribute("class", removeClass);
		break4.setAttribute("class", removeClass);
		break5.setAttribute("class", removeClass);
		break6.setAttribute("class", removeClass);
		/*break7.setAttribute("class", removeClass);
		break8.setAttribute("class", removeClass);
		break9.setAttribute("class", removeClass);*/
		
		page.appendChild(link1); // add gov website
		page.appendChild(break1);
		page.appendChild(link2);	// add web map url
		page.appendChild(break2);
		page.appendChild(link3);	// add web map other
		page.appendChild(break3);
		page.appendChild(link4);	// add web map state
		page.appendChild(break4);
		page.appendChild(link5);	// add comp plan
		page.appendChild(break5);
		page.appendChild(link6);	// add haz mit plan
		page.appendChild(break6);
		/*page.appendChild(link7);	// add climate plan
		page.appendChild(break7);
		page.appendChild(link8);	// add resilience plan
		page.appendChild(break8);
		page.appendChild(link9);	// add zoning url
		page.appendChild(break9);*/
		
		var m;
		var ppupCnty = popupCountyArr.length;
		for (m=0; m < ppupCnty; m++) {
			var link = googleSpreadsheet[i][popupCountyArr[m][2]];
			if (link == 'null') {
				// deactivate link
				if (clickHov == "click") {
					document.getElementById(popupCountyArr[m][0]).style.color = "#CCD1D1";
				} else if (clickHov == "hover") {
					document.getElementById(popupCountyArr[m][3]).style.color = "#CCD1D1";
				}
				
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
	/* // handles adding information for county features */
	
	
	
	
	/* handles removing panel information */
	function removePanelInfo(clickHov) {
		if (clickHov == "click") {
			
			var para = document.getElementsByClassName('gonnaRemoveClick');
			
			while (para[0]) {
				
				para[0].parentNode.removeChild(para[0]);
			}
		} else if (clickHov == "hover") {
			var para = document.getElementsByClassName('gonnaRemoveHover');
			while (para[0]) {
				para[0].parentNode.removeChild(para[0]);
			}
		}
		
	};
	/* // handles removing panel information */
	
	
	
	/* handles adding information for urban features */
	function addUrbanPanelInfo(target, i, clickHov, color) {
		var featureColorSelector;
		if (color == colorPal[1][0]) {
			featureColorSelector = "City of ";
		} else if (color == colorPal[2][0]) {
			featureColorSelector = "Town of ";
		} else if (color == colorPal[3][0]) {
			featureColorSelector = "Village of ";
		}
		
		if (clickHov == "click") {
			var title = document.getElementById("featurePageName");
			var page = document.getElementById('featurePage');
			var pop2000 = document.getElementById("featurePop2000");
			var pop2010 = document.getElementById("featurePop2010");
			var removeClass = "gonnaRemoveClick";
			var link1Attr = popupPointArr[0][0];
			var link2Attr = popupPointArr[1][0];
			var link3Attr = popupPointArr[2][0];
			var link4Attr = popupPointArr[3][0];
			var link5Attr = popupPointArr[4][0];
			var link6Attr = popupPointArr[5][0];
			/*var link7Attr = popupPointArr[6][0];
			var link8Attr = popupPointArr[7][0];*/
		} else if (clickHov == "hover") {
			var title = document.getElementById("hoverFeaturePageName");
			var page = document.getElementById("hoverFeaturePage");
			var pop2000 = document.getElementById("hoverFeaturePop2000");
			var pop2010 = document.getElementById("hoverFeaturePop2010");
			var removeClass = "gonnaRemoveHover";
			var link1Attr = popupPointArr[0][3];
			var link2Attr = popupPointArr[1][3];
			var link3Attr = popupPointArr[2][3];
			var link4Attr = popupPointArr[3][3];
			var link5Attr = popupPointArr[4][3];
			var link6Attr = popupPointArr[5][3];
			/*var link7Attr = popupPointArr[6][3];
			var link8Attr = popupPointArr[7][3];*/
		}
		
		
		title.innerHTML = featureColorSelector + target;
		pop2000.innerHTML = "Population 2000: " + googleSpreadsheet2[i][2];
		pop2010.innerHTML = "Population 2010: " + googleSpreadsheet2[i][3];
					
		var link1 = document.createElement("a");
		var link2 = document.createElement("a");
		var link3 = document.createElement("a");
		var link4 = document.createElement("a");
		var link5 = document.createElement("a");
		var link6 = document.createElement("a");
		/*var link7 = document.createElement("a");
		var link8 = document.createElement("a");*/
					
		var text1 = document.createTextNode("GovtWebURL");
		var text2 = document.createTextNode("WebMapURL");
		var text3 = document.createTextNode("CodeofOrdinanceURL");
		var text4 = document.createTextNode("ZoningURL");
		var text5 = document.createTextNode("CompPlanURL");
		var text6 = document.createTextNode("HazMitPlanURL");
		/*var text7 = document.createTextNode("Cli Plan");
		var text8 = document.createTextNode("Res Plan");*/
					
		link1.appendChild(text1);
		link2.appendChild(text2);
		link3.appendChild(text3);
		link4.appendChild(text4);
		link5.appendChild(text5);
		link6.appendChild(text6);
		/*link7.appendChild(text7);
		link8.appendChild(text8);*/
					
		link1.setAttribute("id", link1Attr);
		link2.setAttribute("id", link2Attr);
		link3.setAttribute("id", link3Attr);
		link4.setAttribute("id", link4Attr);
		link5.setAttribute("id", link5Attr);
		link6.setAttribute("id", link6Attr);
		/*link7.setAttribute("id", link7Attr);
		link8.setAttribute("id", link8Attr);*/
					
		link1.setAttribute("target", "_blank");
		link2.setAttribute("target", "_blank");
		link3.setAttribute("target", "_blank");
		link4.setAttribute("target", "_blank");
		link5.setAttribute("target", "_blank");
		link6.setAttribute("target", "_blank");
		/*link7.setAttribute("target", "_blank");
		link8.setAttribute("target", "_blank");*/
					
		link1.setAttribute("class", removeClass);
		link2.setAttribute("class", removeClass);
		link3.setAttribute("class", removeClass);
		link4.setAttribute("class", removeClass);
		link5.setAttribute("class", removeClass);
		link6.setAttribute("class", removeClass);
		/*link7.setAttribute("class", removeClass);
		link8.setAttribute("class", removeClass);*/
					
		var break1 = document.createElement("br");
		var break2 = document.createElement("br");
		var break3 = document.createElement("br");
		var break4 = document.createElement("br");
		var break5 = document.createElement("br");
		var break6 = document.createElement("br");
		/*var break7 = document.createElement("br");
		var break8 = document.createElement("br");*/
					
		break1.setAttribute('id', 'break1');
		break2.setAttribute('id', 'break2');
		break3.setAttribute('id', 'break3');
		break4.setAttribute('id', 'break4');
		break5.setAttribute('id', 'break5');
		break6.setAttribute('id', 'break6');
		/*break7.setAttribute('id', 'break7');
		break8.setAttribute('id', 'break8');*/
					
		break1.setAttribute('class', removeClass);
		break2.setAttribute('class', removeClass);
		break3.setAttribute('class', removeClass);
		break4.setAttribute('class', removeClass);
		break5.setAttribute('class', removeClass);
		break6.setAttribute('class', removeClass);
		/*break7.setAttribute('class', removeClass);
		break8.setAttribute('class', removeClass);*/
		
		
		page.appendChild(link1);	// gov website
		page.appendChild(break1);
		page.appendChild(link2);	// web map url
		page.appendChild(break2);
		page.appendChild(link3);	// comp plan
		page.appendChild(break3);
		page.appendChild(link4);	// res plan
		page.appendChild(break4);
		page.appendChild(link5);	// haz mit web
		page.appendChild(break5);
		page.appendChild(link6);	// sus plan
		page.appendChild(break6);
		/*page.appendChild(link7);	// cli plan
		page.appendChild(break7);
		page.appendChild(link8);	// zoning web
		page.appendChild(break8);*/
		
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
	/* // handles adding information for urban features */
	
	
	
	function mobileFeatureHide(num) {
		var thePage = document.getElementById('featurePage');
		if (num == 0) {
			thePage.style.right = "100%";
			thePage.classList.add('active');
		} else if (num == 1) {
			thePage.style.right = "";
			thePage.classList.remove('active');
			document.getElementById('mobileFeatureMenu').style.visibility = "visible";
		}
	};
	
	
	
	
	/* fill name space with function or variables so we can access them publicly */
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
		mobileMenuClicked: mobileMenuClicked,
		hoverChecks: hoverChecks,
		mobileFeatureHide: mobileFeatureHide,
		searchCheckToggle: searchCheckToggle,
		hashFilterVar: hashFilterVar
	};
	/* // fill name space with function or variables so we can access them publicly */

};






// start main function on window load
window.onload = main;



