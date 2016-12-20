

var googleSpreadsheet = []; // Array for storing google spreadsheets data: county
var googleSpreadsheet2 = []; // Array for storing google spreadsheets data: urban

// Load Sheets API client library.
function loadSheetsApi() {
    var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
    gapi.client.load(discoveryUrl).then(listMajors);
};

//Print data from spreadsheet
// https://docs.google.com/spreadsheets/d/1JMq9zVGVeMIHE5Bj10ngnGFag3glNUV71yKYk4iyjmw/edit#gid=0
function listMajors() {
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: '1JMq9zVGVeMIHE5Bj10ngnGFag3glNUV71yKYk4iyjmw', 	// can be found from link inside (or above)
		range: 'Sheet1!A2:BK', 										   	// get data from Sheet1, and from columns A through D, starting at row 2
		key: 'AIzaSyDGPkSnN83PuZsEseYhMOSFBH53hpisIRU', 				// google sheets api key, authentication not required for reading
	}).then(function(response) {
		var range = response.result;
		if (range.values.length > 0) {
			for (i=0; i < range.values.length; i++) {
				var row = range.values[i];
				var arr = [row[0], row[7], row[8], row[9]];
				googleSpreadsheet.push(arr);							// send data to googleSpreadsheet array
			}
		} else {
			console.log('No data found.');
		}
	}, function (response) {
		console.log('Error: ' + response.result.error.message);
	});
};


/*
// function to toggle the visibility of layers in the map
function toggleLayers(source) {
	// get id, toggle layer based on id
	// check for an active class to toggle on/off
	var clicked = document.getElementById(source);
	var active = clicked.classList.contains('active');
		
	if (active == true) {
		clicked.classList.remove('active');
		clicked.style.background = '#fff';
		clicked.style.color = 'black';
		// remove layer
	} else if (active == false) {
		clicked.classList.add('active');
		clicked.style.background = '';
		clicked.style.color = '';
		// add layer
	}
};
*/