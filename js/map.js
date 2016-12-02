
/*
	"constants": {
		"@name": "{name_en}",
		"@sans": "Open Sans Regular, Arial Unicode MS Regular",
		"@sans-it": "Open Sans Italic, Arial Unicode MS Regular",
		"@sans-md": "Open Sans Semibold, Arial Unicode MS Bold",
		"@sans-bd": "Open Sans Bold, Arial Unicode MS Bold",
		"@big-label": "#cb4b49",
		"@medium-label": "#f27a87",
		"@small-label": "#384646",
		"@label-halo": "rgba(255,255,255,0.5)",
		"@label-halo-dark": "rgba(0,0,0,0.2)",
		"@land": "#ededed",
		"@water": "#7acad0",
		"@park": "#c2cd44",
		"@building": "#afd3d3",
		"@highway": "#5d6765",
		"@road": "#c0c4c2",
		"@path": "#5d6765",
		"@subway": "#ef7369",
		"@highway-width": {
			"base": 1.55,
			"stops": [[4, 0.5], [8, 1.5], [20, 40]]
		},
		"@road-width": {
			"base": 1.55,
			"stops": [[4, 0.25], [20, 30]]
		},
		"@path-width": {
			"base": 1.8,
			"stops": [[10, 0.15], [20, 15]]
		},
		"@road-misc-width": {
			"base": 1,
			"stops": [[4, 0.25], [20, 30]]
		},
		"@stream-width":{
			"base": 0.5,
			"stops": [[4, 0.5], [10, 1.5], [20, 5]]
		}
	}
*/

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
        }
    ]
};




var clickedCountyName;

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


map.on('click', function(e) {
	var features = map.queryRenderedFeatures(e.point, { layers: ['countyPolygon-fills'] });
	
	if (features.length) {
		map.setFilter('countyPolygon-click', ['==', 'NAME10', features[0].properties.NAME10]);
		clickedCountyName = features[0].properties.NAME10;
	} else {
		map.setFilter('countyPolygon-hover', ['==', 'NAME10', '']);
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
	var features = map.queryRenderedFeatures(e.point, {layers: ['countyPolygon-fills'] });
	map.getCanvas().style.cursor = features.length ? 'pointer' : '';
	
	if (features.length) {
		if (clickedCountyName == features[0].properties.NAME10) {
			return;
		} else {
			map.setFilter('countyPolygon-hover', ['==', 'NAME10', features[0].properties.NAME10]);
		}
	} else {
		map.setFilter('countyPolygon-hover', ['==', 'NAME10', '']);
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
		'source': 'cityPoints',
		'layout': {},
		'paint': {
			'circle-color': 'orange',
			'circle-radius': 5
		}
	});
};


























