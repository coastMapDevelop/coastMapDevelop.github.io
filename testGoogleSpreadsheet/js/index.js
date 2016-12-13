

// Array for storing google spreadsheets data
var googleSpreadsheet = [];

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
		range: 'Sheet1!A2:D', 										   	// get data from Sheet1, and from columns A through D, starting at row 2
		key: 'AIzaSyDGPkSnN83PuZsEseYhMOSFBH53hpisIRU', 				// google sheets api key, authentication not required for reading
	}).then(function(response) {
		var range = response.result;
		if (range.values.length > 0) {
			for (i=0; i < range.values.length; i++) {
				var row = range.values[i];
				//appendPre(row[0] + ', ' + row[2]);
				var arr = [row[0], row[1], row[2], row[3]];
				googleSpreadsheet.push(arr);							// send data to googleSpreadsheet array
			}
			console.log(googleSpreadsheet);
		} else {
			//appendPre('No data found.');
			console.log('No data found.');
		}
	}, function (response) {
		//appendPre('Error: ' + response.result.error.message);
		console.log('Error: ' + response.result.error.message);
	});
};

      
//Append a pre element to the body containing the given message
//as its text node.
/*
function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
};
*/