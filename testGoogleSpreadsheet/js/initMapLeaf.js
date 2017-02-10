
var myNameSpace;	// allows for exposing functions in main()

function main() {
	// run authorization for google spreadsheet API
	loadSheetsApi();
	
	// initiate basemap
    var map = new L.Map('map', {
		attributionControl: true, // add attribution to the map
    	zoomControl: false,		  // add zoom control to the map
        center: [44, -88],		  // coordinates of map initation
		minZoom: 5,				  // minimum zoom level of the map
		maxBounds: [
			[25, -125], 	  //southwest bounds
			[60, -50]    	  //northeast bounds
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
	
	var pointArray = [];
	var polygonArray= [];
	
	var geojson; 			// variable to hold county polygons - layer
	var townsPoints;	 	// variable to hold town points - layer
	var citiesPoints;		// variable to hold city points - layer 
	var villagesPoints;		// variable to hold village points - layer
	var townsPolygon;		// variable to hold town polygons - layer
	var citiesPolygon;		// variable to hold city polygons - layer
	var villagesPolygon;	// variable to hold village polygons - layer
	
	var myMarkers;
	
	// county style
	var myStyle = {
		"fillColor": colorPal[0][0],
		'weight': 1,
		'opacity': 0.75,
		'color': '#fff',
		'fillOpacity': 0.75,
		'zIndex': 9
	};
	
	
	function testColor(d) {
		return d == true ? 'blue' :
			   d == false ? 'orange' :
						'white';
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
		
		if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == colorPal[0][0]) {
			layer.bindTooltip(layer.feature.properties.NAMELSAD10).openTooltip(); // open tooltip on hover with name of county
		
			// set new style for hover county polygon
			layer.setStyle({
				weight: 3,
				//color: '#666',
				fillOpacity: 1,
				zIndex: 11
				//fillColor: testColor(false)
			});
			
		} else if (layer.feature.geometry.type == 'Point') {
			layer.bindTooltip(layer.feature.properties.name).openTooltip(); // open tooltip on hover with name of point
				
			layer.setStyle({
				weight: 3,
				fillOpacity: 1,
			})
			
		} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != colorPal[0][0]) {
			layer.bindTooltip(layer.feature.properties.Name).openTooltip(); // open tooltip on hover with name of urban polygon
			layer.setStyle({
				weight: 3,
				fillOpacity: 1,
				//color: '#666'
			})
		}
	};
	
	// on mouseout
	function resetHighlight(e) {
		if (e.target.feature.geometry.type == 'MultiPolygon' && e.target.options.fillColor == colorPal[0][0]) {
			geojson.resetStyle(e.target); // reset style of county polygons
		} else if (e.target.feature.geometry.type == 'Point') {
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
		this.closeTooltip(); // close tooltip on mouseout
		
		
	};
	
	// on click
	function zoomToFeature(e) {
		//map.fitBounds(e.target.getBounds()); // zoom to feature
		var layer = e.target; // reference layer
		checkFeaturePage("featurePage");
		
		if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor == colorPal[0][0]) {
			//map.fitBounds(e.target.getBounds());
			removeMarkers();
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor); // call function to cross reference clicked layer name with google spreadsheet data
		} else if (layer.feature.geometry.type == 'Point') {
			removeMarkers();
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
			
			
			//map.setView(e.latlng, 9);
			crossReference(e, layer, layer.feature.properties, layer.feature.geometry.type); // call function to cross reference clicked layer name with google spreadsheet data
		} else if (layer.feature.geometry.type == "MultiPolygon" && layer.options.fillColor != colorPal[0][0]) {
			removeMarkers();
			crossReference(e, layer ,layer.feature.properties, layer.feature.geometry.type, layer.options.fillColor); // call function to cross reference clicked layer name with google spreadsheet data
		}
		firstClick = true;
	};
	
	function removeMarkers() {
		myMarkers.clearLayers();
		window.clearInterval(circleInterval);
	};
	
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
			map.setView(e.latlng, 9);
		}
	};
	
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
	function crossReference(e, layer, props, type, color) {
		if (type == 'MultiPolygon' && color == colorPal[0][0]) {
			var target = props.NAME10; // reference
			
			
			// call function to store clicked features
			//stacheClicked(target, e, type);
			
			if (firstClick == false) {
				//do nothing
			} else if (firstClick == true) {
				var para = document.getElementsByClassName('gonnaRemove');
				while (para[0]) {
					para[0].parentNode.removeChild(para[0]);
				}
				/*
				remove1 = document.getElementById('countyLink1');
				remove2 = document.getElementById('countyLink2');
				remove3 = document.getElementById('countyLink3');
				remove4 = document.getElementById('countyLink4');
				remove5 = document.getElementById('countyLink5');
				remove6 = document.getElementById('countyLink6');
				remove7 = document.getElementById('countyLink7');
				remove8 = document.getElementById('countyLink8');
				remove9 = document.getElementById('countyLink9');
				
				removeBreak1 = document.getElementById('break1');
				removeBreak2 = document.getElementById('break2');
				removeBreak3 = document.getElementById('break3');
				removeBreak4 = document.getElementById('break4');
				removeBreak5 = document.getElementById('break5');
				removeBreak6 = document.getElementById('break6');
				removeBreak7 = document.getElementById('break7');
				removeBreak8 = document.getElementById('break8');
				removeBreak9 = document.getElementById('break9');
				
				remove1.parentNode.removeChild(remove1);
				remove2.parentNode.removeChild(remove2);
				remove3.parentNode.removeChild(remove3);
				remove4.parentNode.removeChild(remove4);
				remove5.parentNode.removeChild(remove5);
				remove6.parentNode.removeChild(remove6);
				remove7.parentNode.removeChild(remove7);
				remove8.parentNode.removeChild(remove8);
				remove9.parentNode.removeChild(remove9);
				
				removeBreak1.parentNode.removeChild(removeBreak1);
				removeBreak2.parentNode.removeChild(removeBreak2);
				removeBreak3.parentNode.removeChild(removeBreak3);
				removeBreak4.parentNode.removeChild(removeBreak4);
				removeBreak5.parentNode.removeChild(removeBreak5);
				removeBreak6.parentNode.removeChild(removeBreak6);
				removeBreak7.parentNode.removeChild(removeBreak7);
				removeBreak8.parentNode.removeChild(removeBreak8);
				removeBreak9.parentNode.removeChild(removeBreak9);
				*/
			}
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			for (i=0; i < googleSpreadsheet.length; i++) {
				if (target == googleSpreadsheet[i][0]) {
					
					var title = document.getElementById("featurePageName");
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
					
					link1.setAttribute("id", "countyLink1");
					link2.setAttribute("id", "countyLink2");
					link3.setAttribute("id", "countyLink3");
					link4.setAttribute("id", "countyLink4");
					link5.setAttribute("id", "countyLink5");
					link6.setAttribute("id", "countyLink6");
					link7.setAttribute("id", "countyLink7");
					link8.setAttribute("id", "countyLink8");
					link9.setAttribute("id", "countyLink9");
					
					link1.setAttribute("target", "_blank");
					link2.setAttribute("target", "_blank");
					link3.setAttribute("target", "_blank");
					link4.setAttribute("target", "_blank");
					link5.setAttribute("target", "_blank");
					link6.setAttribute("target", "_blank");
					link7.setAttribute("target", "_blank");
					link8.setAttribute("target", "_blank");
					link9.setAttribute("target", "_blank");
					
					link1.setAttribute("class", "gonnaRemove");
					link2.setAttribute("class", "gonnaRemove");
					link3.setAttribute("class", "gonnaRemove");
					link4.setAttribute("class", "gonnaRemove");
					link5.setAttribute("class", "gonnaRemove");
					link6.setAttribute("class", "gonnaRemove");
					link7.setAttribute("class", "gonnaRemove");
					link8.setAttribute("class", "gonnaRemove");
					link9.setAttribute("class", "gonnaRemove");
					
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
					
					break1.setAttribute("class", "gonnaRemove");
					break2.setAttribute("class", "gonnaRemove");
					break3.setAttribute("class", "gonnaRemove");
					break4.setAttribute("class", "gonnaRemove");
					break5.setAttribute("class", "gonnaRemove");
					break6.setAttribute("class", "gonnaRemove");
					break7.setAttribute("class", "gonnaRemove");
					break8.setAttribute("class", "gonnaRemove");
					break9.setAttribute("class", "gonnaRemove");
					
					var page = document.getElementById('featurePage');
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
					
					/*
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent("<b id='titlePopup'>" + target + " County</b>" + "<hr class='popupLine'>" + "Population 2000: " + googleSpreadsheet[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet[i][2] + "<br>" + "<br>" + 
						"<b id='govPopup'>Resources</b>" + "<hr class='popupLine'>" + "<a id='countyLink1' target='_blank'>Gov Website</a>" + "<br>" + "<a id='countyLink2' target='_blank'>Web Map URL</a>" + "<br>" + "<a id='countyLink3' target='_blank'>Web Map Other</a>" + "<br>" + 
						"<a id='countyLink4' target='_blank'>Web Map State</a>" + "<br>" + "<a id='countyLink5' target='_blank'>Comp Plan</a>" + "<br>" + "<a id='countyLink6' target='_blank'>Haz Mit Plan</a>" + "<br>" + 
						"<a id='countyLink7' target='_blank'>Climate Plan</a>" + "<br>" + "<a id='countyLink8' target='_blank'>Resilience Plan</a>" + "<br>" + "<a id='countyLink9' target='_blank'>Zoning URL</a>").openOn(map);
					*/
					
					// have to check if link is valid
					var m;
					for (m=0; m < popupCountyArr.length; m++) {
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
				}
			}
			
		} else if (type == 'Point') {
			var target = props.name;
			
			// call function to store clicked features
			//stacheClicked(target, e, type);
			
			if (firstClick == false) {
				//do nothing
			} else if (firstClick == true) {
				var para = document.getElementsByClassName('gonnaRemove');
				while (para[0]) {
					para[0].parentNode.removeChild(para[0]);
				}
				
				/*
				remove1 = document.getElementById('pointLink1');
				remove2 = document.getElementById('pointLink2');
				remove3 = document.getElementById('pointLink3');
				remove4 = document.getElementById('pointLink4');
				remove5 = document.getElementById('pointLink5');
				remove6 = document.getElementById('pointLink6');
				remove7 = document.getElementById('pointLink7');
				remove8 = document.getElementById('pointLink8');
				
				removeBreak1 = document.getElementById('break1');
				removeBreak2 = document.getElementById('break2');
				removeBreak3 = document.getElementById('break3');
				removeBreak4 = document.getElementById('break4');
				removeBreak5 = document.getElementById('break5');
				removeBreak6 = document.getElementById('break6');
				removeBreak7 = document.getElementById('break7');
				removeBreak8 = document.getElementById('break8');
				
				remove1.parentNode.removeChild(remove1);
				remove2.parentNode.removeChild(remove2);
				remove3.parentNode.removeChild(remove3);
				remove4.parentNode.removeChild(remove4);
				remove5.parentNode.removeChild(remove5);
				remove6.parentNode.removeChild(remove6);
				remove7.parentNode.removeChild(remove7);
				remove8.parentNode.removeChild(remove8);
				
				removeBreak1.parentNode.removeChild(removeBreak1);
				removeBreak2.parentNode.removeChild(removeBreak2);
				removeBreak3.parentNode.removeChild(removeBreak3);
				removeBreak4.parentNode.removeChild(removeBreak4);
				removeBreak5.parentNode.removeChild(removeBreak5);
				removeBreak6.parentNode.removeChild(removeBreak6);
				removeBreak7.parentNode.removeChild(removeBreak7);
				removeBreak8.parentNode.removeChild(removeBreak8);
				*/
			}
			
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			for (i=0; i < googleSpreadsheet2.length; i++) {
				if (target == googleSpreadsheet2[i][0]) {
					
					var title = document.getElementById("featurePageName");
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
					
					link1.setAttribute("id", "pointLink1");
					link2.setAttribute("id", "pointLink2");
					link3.setAttribute("id", "pointLink3");
					link4.setAttribute("id", "pointLink4");
					link5.setAttribute("id", "pointLink5");
					link6.setAttribute("id", "pointLink6");
					link7.setAttribute("id", "pointLink7");
					link8.setAttribute("id", "pointLink8");
					
					link1.setAttribute("target", "_blank");
					link2.setAttribute("target", "_blank");
					link3.setAttribute("target", "_blank");
					link4.setAttribute("target", "_blank");
					link5.setAttribute("target", "_blank");
					link6.setAttribute("target", "_blank");
					link7.setAttribute("target", "_blank");
					link8.setAttribute("target", "_blank");
					
					link1.setAttribute("class", "gonnaRemove");
					link2.setAttribute("class", "gonnaRemove");
					link3.setAttribute("class", "gonnaRemove");
					link4.setAttribute("class", "gonnaRemove");
					link5.setAttribute("class", "gonnaRemove");
					link6.setAttribute("class", "gonnaRemove");
					link7.setAttribute("class", "gonnaRemove");
					link8.setAttribute("class", "gonnaRemove");
					
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
					
					break1.setAttribute('class', 'gonnaRemove');
					break2.setAttribute('class', 'gonnaRemove');
					break3.setAttribute('class', 'gonnaRemove');
					break4.setAttribute('class', 'gonnaRemove');
					break5.setAttribute('class', 'gonnaRemove');
					break6.setAttribute('class', 'gonnaRemove');
					break7.setAttribute('class', 'gonnaRemove');
					break8.setAttribute('class', 'gonnaRemove');
					
					var page = document.getElementById('featurePage');
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
					
					
					
					
					/*
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent("<b id='titlePopup'>" + target + "</b>" + "<hr class='popupLine'>" + "Population 2000: " + googleSpreadsheet2[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet2[i][2] + "<br>" + "<br>" + 
						"<b id='govPopup'>Resources</b>" + "<hr class='popupLine'>" + "<a id='pointLink1' target='_blank'>Govt Web</a>" + "<br>" + "<a id='pointLink2' target='_blank'>Map Web</a>" + "<br>" + "<a id='pointLink3' target='_blank'>Comp Plan</a>" + "<br>" + 
						"<a id='pointLink4' target='_blank'>Zoning Web</a>" + "<br>" + "<a id='pointLink5' target='_blank'>Haz Mit Web</a>" + "<br>" + "<a id='pointLink6' target='_blank'>Sus Plan</a>" + "<br>" + 
						"<a id='pointLink7' target='_blank'>Cli Plan</a>" + "<br>" + "<a id='pointLink8' target='_blank'>Res Plan</a>").openOn(map);
					// add other positions in array
					*/
					
					// have to check if link is valid
					var m;
					for (m=0; m < popupPointArr.length; m++) {
						var link = googleSpreadsheet2[i][popupPointArr[m][2]];
						if (link == 'null') {
							// deactivate link
							document.getElementById(popupPointArr[m][0]).style.color = "#CCD1D1";
						} else {
							// activate link
							document.getElementById(popupPointArr[m][0]).setAttribute("href", link);
						}
					}
				}
			}
		} else if (type == 'MultiPolygon' && color != colorPal[0][0]) {
			var target = props.Name;
			
			// call function to store clicked features
			//stacheClicked(target, e, type);
			if (firstClick == false) {
				//do nothing
			} else if (firstClick == true) {
				var para = document.getElementsByClassName('gonnaRemove');
				while (para[0]) {
					para[0].parentNode.removeChild(para[0]);
				}
			}
			
			
			// loop to retrieve necessary data from spreadsheet 
			var i;
			for (i=0; i < googleSpreadsheet2.length; i++) {
				if (target == googleSpreadsheet2[i][0]) {
					
					var title = document.getElementById("featurePageName");
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
					
					link1.setAttribute("id", "polyLink1");
					link2.setAttribute("id", "polyLink2");
					link3.setAttribute("id", "polyLink3");
					link4.setAttribute("id", "polyLink4");
					link5.setAttribute("id", "polyLink5");
					link6.setAttribute("id", "polyLink6");
					link7.setAttribute("id", "polyLink7");
					link8.setAttribute("id", "polyLink8");
					
					link1.setAttribute("target", "_blank");
					link2.setAttribute("target", "_blank");
					link3.setAttribute("target", "_blank");
					link4.setAttribute("target", "_blank");
					link5.setAttribute("target", "_blank");
					link6.setAttribute("target", "_blank");
					link7.setAttribute("target", "_blank");
					link8.setAttribute("target", "_blank");
					
					link1.setAttribute("class", "gonnaRemove");
					link2.setAttribute("class", "gonnaRemove");
					link3.setAttribute("class", "gonnaRemove");
					link4.setAttribute("class", "gonnaRemove");
					link5.setAttribute("class", "gonnaRemove");
					link6.setAttribute("class", "gonnaRemove");
					link7.setAttribute("class", "gonnaRemove");
					link8.setAttribute("class", "gonnaRemove");
					
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
					
					break1.setAttribute('class', 'gonnaRemove');
					break2.setAttribute('class', 'gonnaRemove');
					break3.setAttribute('class', 'gonnaRemove');
					break4.setAttribute('class', 'gonnaRemove');
					break5.setAttribute('class', 'gonnaRemove');
					break6.setAttribute('class', 'gonnaRemove');
					break7.setAttribute('class', 'gonnaRemove');
					break8.setAttribute('class', 'gonnaRemove');
					
					var page = document.getElementById('featurePage');
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
					
					/*
					// set clicked popup with data and add to map
					popup.setLatLng(e.latlng).setContent("<b id='titlePopup'>" + target + "</b>" + "<hr class='popupLine'>" + "Population 2000: " + googleSpreadsheet2[i][1] + "<br>" + "Population 2010: " + googleSpreadsheet2[i][2] + "<br>" + "<br>" + 
						"<b id='govPopup'>Resources</b>" + "<hr class='popupLine'>" + "<a id='polyLink1' target='_blank'>Govt Web</a>" + "<br>" + "<a id='polyLink2' target='_blank'>Map Web</a>" + "<br>" + "<a id='polyLink3' target='_blank'>Comp Plan</a>" + "<br>" + 
						"<a id='polyLink4' target='_blank'>Zoning Web</a>" + "<br>" + "<a id='polyLink5' target='_blank'>Haz Mit Web</a>" + "<br>" + "<a id='polyLink6' target='_blank'>Sus Plan</a>" + "<br>" + 
						"<a id='polyLink7' target='_blank'>Cli Plan</a>" + "<br>" + "<a id='polyLink8' target='_blank'>Res Plan</a>").openOn(map);
					// add other positions in array
					*/
					
					// have to check if link is valid
					var m;
					for (m=0; m < popupPolyArr.length; m++) {
						var link = googleSpreadsheet2[i][popupPolyArr[m][2]];
						if (link == 'null') {
							// deactivate link
							document.getElementById(popupPolyArr[m][0]).style.color = "#CCD1D1";
						} else {
							// activate link
							document.getElementById(popupPolyArr[m][0]).setAttribute("href", link);
						}
					}
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
			// experimental
			searchCtrl.indexFeatures(data, ['NAME10', 'NAMELSAD10']);
			geojson = L.geoJson(data, {
				style: myStyle,					// set style to myStyle variable
				onEachFeature: onEachFeature	// set onEachFeature to onEachFeature function
			})
			.addTo(map);
			myMarkers = L.featureGroup().addTo(map);
			addLayers(); // calls function to add urban layers
		}
	});
	
	// add separate layers on top of county polygons
	function addLayers() {
		
		// loads in geojson data for town points
		$.ajax({
			dataType: 'json',
			url: "data/geojson/Towns.geojson",
			success: function(data) {
				// experimental
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
			if (source == "bubble01") {
				map.removeLayer(geojson);
			} else if (source == "bubble02") {
				map.removeLayer(citiesPoints);
				map.removeLayer(citiesPolygon);
				
				var pointSpot = pointArray.indexOf(citiesPoints);
				var polygonSpot = polygonArray.indexOf(citiesPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				//(pointArray);
				//(polygonArray);
		
			} else if (source == "bubble03") {
				map.removeLayer(townsPoints);
				map.removeLayer(townsPolygon);
				
				var pointSpot = pointArray.indexOf(townsPoints);
				var polygonSpot = polygonArray.indexOf(townsPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				//(pointArray);
				//(polygonArray);
				
			} else if (source == "bubble04") {
				map.removeLayer(villagesPoints);
				map.removeLayer(villagesPolygon);
				
				var pointSpot = pointArray.indexOf(villagesPoints);
				var polygonSpot = polygonArray.indexOf(villagesPolygon);
				
				pointArray.splice(pointSpot, 1);
				polygonArray.splice(polygonSpot, 1);
				
				//(pointArray);
				//(polygonArray);
				
			}
		} else if (x == 1) {
			// add layer
			if (source == "bubble01") {
				map.addLayer(geojson);
				geojson.bringToBack();
			} else if (source == "bubble02") {
				// check zoom level
				if (currentZoom >= 10) {
					map.addLayer(citiesPolygon);
				} else if (currentZoom <= 9) {
					map.addLayer(citiesPoints);
				}
				polygonArray.push(citiesPolygon);
				pointArray.push(citiesPoints);
			} else if (source == "bubble03") {
				// check zoom level
				if (currentZoom >= 10) {
					map.addLayer(townsPolygon);
				} else if (currentZoom <= 9 ) {
					map.addLayer(townsPoints);
				}
				polygonArray.push(townsPolygon);
				pointArray.push(townsPoints);
			} else if (source == "bubble04") {
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
	
	// function that allows reseting of the maps extent to original
	function home() {
		map.setView(new L.LatLng(44, -88), 6);
	};
	
	// function that handles changing of the base map
	function changeBaseMap(source) {
		map.removeLayer(baseLayers[currentLayer]);
		currentLayer = source;
		baseLayers[source].addTo(map);
		
		var image = document.getElementById(source);
		var active = image.classList.contains('active');
		
	};
	
	
	function testFilter() {
		testCheckArr.length = 0;
		var i;
		for (i=0; i < currentCheckArr.length; i++) {		// go throuch each attribute in currentCheckArr
			geojson.eachLayer(function (layer) {			// go through each layer in geojson layer
				var name = layer.feature.properties.NAME10;	// get the name of the layer
				// for this layer only, find the match row on the google spreadsheet
				var m;
				for(m=0; m < googleSpreadsheet.length; m++) {
					if (name == googleSpreadsheet[m][0]) {
						var row = m; 			// match row is found
						
						var j;
						for (j=0; j < popupCountyArr.length; j++) {	// now loop through the county arr array which contains the positions of each website attribute
							if (googleSpreadsheet[m][popupCountyArr[j][2]] == 'null') {	// and check if the google spreadsheet location is null
								console.log(googleSpreadsheet[m][popupCountyArr[j][2]]);
							} else if (googleSpreadsheet[m][popupCountyArr[j][2]] != 'null') {
								console.log(googleSpreadsheet[m][popupCountyArr[j][2]]);
							}
						}
					} else {
						// do nothing
					}
				}
				/*
				var m;
				for (m=0; m < googleSpreadsheet.length; m++) { // loop through the spreadsheet
					if (name == googleSpreadsheet[m][0]) {		// check the name with our googleSpreadsheet database
						console.log(name);
						*/
						/*
						index2 = m;
						var j;
						for (j=0; j < popupPointArr.length; j++) {				// go through the popupPointArr array
							if (currentCheckArr[i] == popupPointArr[j][1]) {	// when we find the position that the currentCheckArr corresponds to...
								index = j										// store it in the index variable
							} else {
								// do nothing
							}
						}
						// check if that layer has the attribute
						var target = popupPointArr[j][2];
						if (googleSpreadsheet[m][target] == 'null') {
							testCheckArr.push(false);
							// populate that layer's "BLANK" attribute field as false
						} else if (googleSpreadsheet[m][target] != 'null') {
							// populate that layer's "BLANK" attribute field as true
							testCheckArr.push(true);
						}
					} else {
						// do nothing
					}
					*/
			});
		}
		// set new style for hover county polygon
		/*
		geojson.setStyle({
			fillColor: testColor(testCheckArr)
		});
		*/
	};
	
	
	function zoomSearchedFeature(source) {
		geojson.eachLayer(function (layer) {		// go through each layer in county geojson
			var name = layer.feature.properties.NAME10;	// store the name of the layer
			
			if (name == source) {		// of the layer's name equals the clicked sources name
				console.log(name);
				// zoom to that feature
				// populate the menu
			}
		});
	};
	
	
	// fill name space with function variables so we can use them publicly
	myNameSpace = {
		toggle: toggle,
		home: home,
		changeBaseMap: changeBaseMap,
		testZoom: testZoom,
		removeMarkers: removeMarkers,
		testFilter: testFilter,
		zoomSearchedFeature: zoomSearchedFeature
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
			name.innerHTML = props.NAME10;
			name.setAttribute("id", props.NAME10);
			name.setAttribute("onclick", "myNameSpace.zoomSearchedFeature(this.id)");
			container.appendChild(L.DomUtil.create('br', null, container));
			container.appendChild(document.createTextNode(props.NAMELSAD10));
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
	
	
	
	// experimental

};






// start main function on window load
window.onload = main;


// function to toggle the visibility of layers in the map
function toggleLayers(source) {
	// check for an active class to toggle on/off
	var clicked = document.getElementById(source);
	var active = clicked.classList.contains('active');
	
	if (active == true) {
		clicked.classList.remove('active');
		clicked.style.background = '#fff';
		myNameSpace.toggle(source, 0);
		// remove layer
	} else if (active == false) {
		clicked.classList.add('active');
		var i;
		for (i=0; i<colorPal.length; i++) {
			if (source == colorPal[i][1]) {
				clicked.style.background = colorPal[i][0];
			}
		}
		
		myNameSpace.toggle(source, 1);
		// add layer
	}
};

// function that calls inner function from main() (to zoom to the clicked feature)
function clickedQueryItem(source) {
	var position = recentClickArr.indexOf(source);
	var item = storedEClicked[position];
	//map.fitBounds(item.target.getBounds()); // zoom to feature
	//myNameSpace.zoomToFeature(storedEClicked[position]);
	myNameSpace.testZoom(item, position);
};


