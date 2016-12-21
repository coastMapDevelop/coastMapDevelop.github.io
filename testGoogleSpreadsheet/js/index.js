

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
				var arr = [row[0], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[17], row[23], row[24]];
				googleSpreadsheet.push(arr);							// send data to googleSpreadsheet array
			}
		} else {
			console.log('No data found.');
		}
	}, function (response) {
		console.log('Error: ' + response.result.error.message);
	});
};

function expMenuButton() {
	var menu = document.getElementById("expMenu");
	var active = menu.classList.contains('active');
	
	var layer1 = document.getElementById("expLayer01");
		layer2 = document.getElementById("expLayer02");
		layer3 = document.getElementById("expLayer03");
		layer4 = document.getElementById("expLayer04");
	
	var icon = document.getElementById("menuIcon1");
	if (active == false) {
		menu.classList.add('active');
		
		icon.classList.remove('fa', 'fa-bars', 'fa-2x');
		icon.classList.add('fa', 'fa-times', 'fa-2x');
		
		layer1.style.opacity = "1";
		layer1.style.visibility = "visible";
		layer1.style.top = "-50px";
	
		layer2.style.opacity = "1";
		layer2.style.visibility = "visible";
		layer2.style.right = "50px";
	
		layer3.style.opacity = "1";
		layer3.style.visibility = "visible";
		layer3.style.top = "50px";
	
		layer4.style.opacity = "1";
		layer4.style.visibility = "visible";
		layer4.style.right = "-50px";
	} else if (active == true) {
		menu.classList.remove('active');
		
		icon.classList.remove('fa', 'fa-times', 'fa-2x');
		icon.classList.add('fa', 'fa-bars', 'fa-2x');
		
		layer1.style.opacity = "";
		layer1.style.top = "";
	
		layer2.style.opacity = "";
		layer2.style.right = "";
	
		layer3.style.opacity = "";
		layer3.style.top = "";
	
		layer4.style.opacity = "";
		layer4.style.right = "";
		
		setTimeout(function(){ 
			layer1.style.visibility = "";
			layer2.style.visibility = "";
			layer3.style.visibility = "";
			layer4.style.visibility = "";
		}, 500);
	}
};


function baseHover() {
	var base = document.getElementById("baseMapButton");
	
	base.style.width = "200px";
	base.style.height = "200px";
};

function baseOut() {
	var base = document.getElementById("baseMapButton");
	
	base.style.width = "";
	base.style.height = "";
};