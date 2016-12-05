



var simpleMapzen = {
    "version": 8,
    "sources": {
        "osm": {
            "type": "vector",
            "tiles": ["https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt?api_key=vector-tiles-mapzen-6449F4S"]
        }
    },
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#ededed"
            }
        }, {
            "id": "water",
            "type": "fill",
            "source": "osm",
            "source-layer": "water",
            "filter": ["==", "$type", "Polygon"],
            "paint": {
                "fill-color": "#7acad0"
            }
        }, {
        	"id": "river",
    		"source": "osm",
    		"source-layer": "water",
    		"type": "line",
    		"min-zoom": 6,
    		"filter": ["all", ["==", "$type", "LineString"], ["==", "kind", "river"]],
    		"layout": {
        		"line-cap": "round",
        		"line-join": "round"
      		},
    		"paint": {
      			"line-color": "#7acad0",
      			"line-width": {
        			"base": 1.2,
        			"stops": [[8, 0.75], [20, 15]]
      			}
    		}
        }
    ]
};


var simpleOpenstreet = {
	"version": 8,
    "sources": {
        "simple-tiles": {
            "type": "raster",
            "tiles": ["http://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256
        }
    },
    "layers": [{
        "id": "simple-tiles",
        "type": "raster",
        "source": "simple-tiles",
        "minzoom": 0,
        "maxzoom": 22
    }]
};





var clickedCountyName;

if (!mapboxgl.supported()) {
	alert('Your browser does not support Mapbox GL');
} else {
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: simpleMapzen,
		center: [-88.7879, 43.7844], // starting position
		zoom: 5.75 // starting zoom
	});
}

// disable map rotation using click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();


// Create a popup, but don't add it to the map yet
var popup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});



map.on('load', function() {
	
	addSources(); // Call to function to add data sources
	
	addLayers(); // Call to function to add layers to map
	
});


map.on('click', function(e) {
	var features = map.queryRenderedFeatures(e.point, { layers: ['countyPolygon-fills', 'cityPoints', 'villagePoints', 'townPoints'] });
	
	if (features.length) {
		map.setFilter('countyPolygon-click', ['==', 'FID_1', features[0].properties.NAME10]);
		clickedCountyName = features[0].properties.NAME10;
	} else {
		map.setFilter('countyPolygon-hover', ['==', 'FID_1', '']);
		popup2.remove();
		return;
	}
	
	var feature = features[0];
	
	popup.remove();
	
	var popup2 = new mapboxgl.Popup()
		.setLngLat(map.unproject(e.point))
		.setHTML(feature.properties.NAME10 + " County" + "<br>" + "Population 2010: " + feature.properties.POP2010 + "<br>" + "Population 2000: " + feature.properties.POP2000 + "<br>"
			+ "<a href='"+ feature.properties.Govt_Websi + "' target='_blank'>Government Website</a>")
		.addTo(map);
	
	console.log(popup2.innerHTML);
});


map.on('mousemove', function(e) {
	var features = map.queryRenderedFeatures(e.point, {layers: ['countyPolygon-fills', 'cityPoints', 'villagePoints', 'townPoints'] });
	map.getCanvas().style.cursor = features.length ? 'pointer' : '';
	
	if (features.length) {
		console.log(features);
		if (clickedCountyName == features[0].properties.NAME10) {
			return;
		} else {
			map.setFilter('countyPolygon-hover', ['==', 'FID_1', features[0].properties.NAME10]);
		}
	} else {
		map.setFilter('countyPolygon-hover', ['==', 'FID_1', '']);
		popup.remove();
		return;
	}
	
	var feature = features[0];
	
	// populate the popup and set its coordinates
	// base on the feature found
	
	popup.setLngLat(map.unproject(e.point))
		.setHTML(feature.properties.NAME10 + " County" + "<br>" + "Click for more info")
		.addTo(map);
});



map.on('mouseout', function() {
	map.setFilter('countyPolygon-hover', ['==', 'FID_1', '']);
});



// Stores map sources
function addSources() {
	map.addSource('countyPolygons', {
		'type': 'geojson',
		'data': '/testMapboxGL/data/geojson/countyPolygon_v2.geojson'
	});
	
	map.addSource('urbanPoints', {
		'type': 'geojson',
		'data': '/testMapboxGL/data/geojson/citiesPoints_v1.geojson'
	});
	
	map.addSource('urbanPolygons', {
		'type': 'geojson',
		'data': '/testMapboxGL/data/geojson/citiesPolygons_v2.geojson'
	});
};



// Stores layers
function addLayers() {
	map.addLayer({
		'id': 'countyPolygon-fills',
		'type': 'fill',
		'source': 'countyPolygons',
		'layout': {},
		'paint': {
			'fill-color': '#627BC1',
			'fill-opacity': 0.5
		}
	});
	
	map.addLayer({
		'id': 'countyPolygon-borders',
		'type': 'line',
		'source': 'countyPolygons',
		'layout': {},
		'paint': {
			'line-color': '#627BC1',
			'line-width': 1
		}
	});
	
	map.addLayer({
		'id': 'countyPolygon-hover',
		'type': 'fill',
		'source': 'countyPolygons',
		'layout': {},
		'paint': {
			'fill-color': '#627BC1',
			'fill-opacity': 1
		},
		'filter': ['==', 'NAME10', '']
	});
	
	map.addLayer({
		'id': 'countyPolygon-click',
		'type': 'fill',
		'source': 'countyPolygons',
		'layout': {},
		'paint': {
			'fill-color': '#627BC1',
			'fill-opacity': 1
		},
		'filter': ['==', 'NAME10', '']
	});
	
	map.addLayer({
		'id': 'cityPoints',
		'type': 'circle',
		'source': 'urbanPoints',
		'layout': {},
		'paint': {
			'circle-color': 'orange',
			'circle-radius': 5
		},
		'filter': ["==", "LSAD", 25]
	});
	
	map.addLayer({
		'id': 'villagePoints',
		'type': 'circle',
		'source': 'urbanPoints',
		'layout': {},
		'paint': {
			'circle-color': 'black',
			'circle-radius': 5
		},
		'filter': ["==", "LSAD", 47]
	});
	
	map.addLayer({
		'id': 'townPoints',
		'type': 'circle',
		'source': 'urbanPoints',
		'layout': {},
		'paint': {
			'circle-color': 'green',
			'circle-radius': 5
		},
		'filter': ["==", "LSAD", 43]
	})
};


























