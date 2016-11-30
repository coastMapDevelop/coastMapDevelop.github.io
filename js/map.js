
var simple = {
	"version": 8,
	"sources": {
		"osm": {
			"type": "vector",
			"tiles": ["https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt?api_key=vector-tiles-LM25tq4"]
		}
	},
	"layers": [
		{
			"id": "background",
			"type": "background",
			"paint": {
				"background-color": "#41afa5"
			}
		}, {
			"id": "water",
			"type": "fill",
			"source": "osm",
			"source-layer": "water",
			"filter": ["==", "$type", "Polygon"],
			"paint": {
				"fill-color": "#3887be"
			}
		}
	]
};

if (!mapboxgl.supported()) {
	alert('Your browser does not support Mapbox GL');
} else {
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: simple, // variable above, using Mapzen tiles
		center: [-88.0198, 44.5192], // starting position
		zoom: 1 // starting zoom
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


map.on('mousemove', function(e) {
	var features = map.queryRenderedFeatures(e.point, {layers: ['countyPolygon-fills'] });
	map.getCanvas().style.cursor = features.length ? 'pointer' : '';
	
	if (features.length) {
		map.setFilter('countyPolygon-hover', ['==', 'NAME10', features[0].properties.NAME10]);
	} else {
		map.setFilter('countyPolygon-hover', ['==', 'NAME10', '']);
		popup.remove();
		return;
	}
	
	var feature = features[0];
	
	// populate the popup and set its coordinates
	// base on the feature found
	
	popup.setLngLat(map.unproject(e.point))
		.setHTML('test')
		.addTo(map);
});


map.on('mouseout', function() {
	map.setFilter('countyPolygon-hover', ['==', 'NAME10', '']);
});



// Stores map sources
function addSources() {
	map.addSource('countyPolygons', {
		'type': 'geojson',
		'data': '/data/geojson/countyPolygon_v2.geojson'
	});
	
	map.addSource('cityPoints', {
		'type': 'geojson',
		'data': '/data/geojson/citiesPoints_v1.geojson'
	});
	
	map.addSource('cityPolygons', {
		'type': 'geojson',
		'data': '/data/geojson/citiesPolygons_v2.geojson'
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
		'id': 'cityPoints',
		'type': 'circle',
		'source': 'cityPoints',
		'layout': {},
		'paint': {
			'circle-color': 'orange',
			'circle-radius': 5
		}
	});
};


























