

function main() {
    var map = new L.Map('map', {
        zoomControl: false,
        center: [-88.7879, 43.7844],
        zoom: 5
    });
	
	/*
	L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
    }).addTo(map);
	*/
	
	var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	
	var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
	});
	
	//Esri_WorldStreetMap.addTo(map);
	OpenSreetMap_Mapnik.addTo(map);
	
	/*
	cartodb.createLayer(map, 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json')
        .addTo(map)
        .on('done', function(layer) {
			layer.setInteraction(true);
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
	
	




















