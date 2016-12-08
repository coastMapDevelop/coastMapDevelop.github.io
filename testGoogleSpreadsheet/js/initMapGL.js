
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

var map = new mapboxgl.Map({
    container: 'map',
    style: simple,
    zoom: 1,
    center: [-14, 35]
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {
	alert('test');
});