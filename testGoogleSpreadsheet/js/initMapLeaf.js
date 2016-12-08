
function main() {
    var map = new L.Map('map', {
    	zoomControl: false,
        center: [43, 0],
        zoom: 3
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
	OpenStreetMap_Mapnik.addTo(map);
	
	
	/*
	cartodb.createLayer(map, 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json')
        .addTo(map)
        .on('done', function(layer) {
			layer.setInteraction(true);
			layer.setZindex(5);
			layer.on('featureOver', function(e, latlng, pos, data) {
				cartodb.log.log(e, latlng, pos, data);
			});
			layer.on('error', function(err) {
				cartodb.log.log('error: ' + err);
			});
        }).on('error', function() {
			cartodb.log.log("some error occurred");
        });
        */
    
    
	
};

window.onload = main;