

var googleSpreadsheet = []; // Array for storing google spreadsheets data: county
var googleSpreadsheet2 = []; // Array for storing google spreadsheets data: urban

// Load Sheets API client library.
function loadSheetsApi() {
    var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
    gapi.client.load(discoveryUrl).then(listMajors);
};

//Print data from spreadsheet
// https://docs.google.com/spreadsheets/d/1JMq9zVGVeMIHE5Bj10ngnGFag3glNUV71yKYk4iyjmw/edit#gid=0  = old spreadsheet
// https://docs.google.com/spreadsheets/d/1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA/edit#gid=0  = new spreadsheet
function listMajors() {
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: '1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA', 	// can be found from link inside (or above)
		range: 'Sheet1!A2:BK', 										   	// get data from Sheet1, and from columns A through BK, starting at row 2
		key: 'AIzaSyDGPkSnN83PuZsEseYhMOSFBH53hpisIRU', 				// google sheets api key, authentication not required for reading
	}).then(function(response) {
		var range = response.result;
		if (range.values.length > 0) {
			for (i=0; i < range.values.length; i++) {
				var row = range.values[i];
				var arr = [row[0], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[17], row[22], row[23], row[24]];
				googleSpreadsheet.push(arr);							// send data to googleSpreadsheet array
			}
		} else {
			console.log('No data found.');
		}
	}, function (response) {
		console.log('Error: ' + response.result.error.message);
	});
	
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: '1FGzCf7ty2Id6vb6sGo14EZzdPU9Vsj7qXAs2YrISkqA', 	// can be found from link inside (or above)
		range: 'Sheet2!A2:AD', 										   	// get data from Sheet1, and from columns A through AD, starting at row 2
		key: 'AIzaSyDGPkSnN83PuZsEseYhMOSFBH53hpisIRU', 				// google sheets api key, authentication not required for reading
	}).then(function(response) {
		var range = response.result;
		if (range.values.length > 0) {
			for (i=0; i < range.values.length; i++) {
				var row = range.values[i];
				var arr = [row[0], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]];
				googleSpreadsheet2.push(arr);	// send data to googleSpreadsheet array
			}
		} else {
			console.log('No data found.');
		}
	}, function (response) {
		console.log('Error: ' + response.result.error.message);
	});
};


// function to display base map container on click
function baseClick() {
	var container = document.getElementById('baseMapContainer');
	container.style.opacity = "1";
	container.style.visibility = "visible";
};

// function to remove base map container click
function toggleClick() {
	var container = document.getElementById('baseMapContainer');
	container.style.opacity = "";
	container.style.visibility = "";
};

// function to remove query container click
function queryToggle() {
	var container = document.getElementById('queryContainer');
	container.style.opacity = "";
	container.style.visibility = "";
};

// function to open the query menu containing recent feature clicks on click
function queryClicked(source) {
	var theButton = document.getElementById(source);
	var active = theButton.classList.contains('active');
	
	var queryBox = document.getElementById('queryContainer');
	
	if (active == false) {
		console.log('do nothing');
	} else if (active == true) {
		queryBox.style.opacity = '1';
		queryBox.style.visibility = 'visible';
	}
};

// function to show tooltip on button hover
function showTooltip(source) {
	var position;
	if (source == "homeButton") {
		position = "homeButtonTooltip";
	} else if (source == "baseMapButton") {
		position = "baseMapButtonTooltip";
	} else if (source == "queryButton") {
		position = "queryButtonTooltip";
	}
	var tooltip = document.getElementById(position);
	tooltip.style.opacity = "1";
	tooltip.style.visibility = "visible";
}

// function to remove tooltip on button hover
function removeTooltip(source) {
	var position;
	if (source == "homeButton") {
		position = "homeButtonTooltip";
	} else if (source == "baseMapButton") {
		position = "baseMapButtonTooltip";
	} else if (source == "queryButton") {
		position = "queryButtonTooltip";
	}
	var tooltip = document.getElementById(position);
	tooltip.style.opacity = "0";
	tooltip.style.visibility = "hidden";
}

function displaySupMenu(source) {
	var button = document.getElementById(source);
	var active = button.classList.contains("active");
	var position;
	var i;
	for (i=0; i < supSideArr.length; i++) {
		if (source == supSideArr[i][0]) {
			position = supSideArr[i][1];
		}
	}
	var move = document.getElementById(position);
	if (active == true) {
		move.style.left = "100%";
		button.classList.remove("active");
		setTimeout(function(){
			move.style.top = "100%";
			move.style.left = "-150px"
		}, 310);
		setTimeout(function(){
			move.style.top = "0px";
		}, 610);
	} else if (active == false) {
		move.style.left = "75px";
		button.classList.add("active");
		
		// check if other buttons are active, then move if they are
		// if aren't active, do nothing
	
		var n;
		for (n=0; n < supSideArr.length; n++) {
			var check = supSideArr[n][0];
			var box = document.getElementById(check);
			var active1 = box.classList.contains("active");
			if (active1 == true && check != source) {
				var position1 = supSideArr[n][1];
				var remove = document.getElementById(position1);
				remove.style.left = "100%";
				box.classList.remove("active");
				setTimeout(function(){
					remove.style.top = "100%";
					remove.style.left = "-150px"
				}, 310);
				setTimeout(function(){
					remove.style.top = "0px";
				}, 610);
			} else if (active1 == false) {
				
			}
		}
	}
}

function uiHover(source, num) {
	var circle = document.getElementById(source);
	var box;
	var circleCross;
	
	// loop to find corresponding box
	var i;
	for (i=0; i < uiMenuArr.length; i++) {
		if (uiMenuArr[i][1] == source) {
			box = document.getElementById(uiMenuArr[i][0]);
			circleCross = document.getElementById(uiMenuArr[i][2]);
		}
	}
	
	if (num == 1) {
		// hovered, display box
		circle.style.opacity = "1";
		box.style.right = "0";
	} else if (num == 0) {
		// out, remove box
		circle.style.opacity = "";
		box.style.right = "";
	} else if (num == 2) {
		var active = circleCross.classList.contains("active");
		if (active == true) {
			circleCross.style.right = "";
			circleCross.classList.remove("active");
		} else if (active == false) {
			var x = window.innerWidth;
			if (x <= 600) {
				circleCross.style.right = "0";
			} else if (x > 600) {
				circleCross.style.right = "75px";
			}
			circleCross.classList.add("active");
			var j;
			for (j=0; j < uiMenuArr.length; j++) {
				if (uiMenuArr[j][1] != source) {
					var checkQuick = document.getElementById(uiMenuArr[j][2]);
					checkQuick.style.right = "";
					checkQuick.classList.remove("active");
				}
			}
			myNameSpace.removeMarkers();
		}
	} else if (num == 3) {
		var q;
		for (q=0; q < uiMenuArr.length; q++) {
			if (uiMenuArr[q][3] == source) {
				var position = uiMenuArr[q][2];
				var toggle = document.getElementById(position);
				toggle.style.right = "";
				toggle.classList.remove('active');
			}
		}
		if (source == "featurePageToggle") {
			myNameSpace.removeMarkers();
		} else {
			// do nothing
		}
	}
};

function checkFeaturePage(source) {
	var page = document.getElementById("featurePage");
	var active = page.classList.contains('active');
	
	if (active == false) {
		var x = window.innerWidth;
		console.log(x);
		if (x <= 600) {
			page.style.right = "0px";
		} else if (x > 600) {
			page.style.right = "75px";
		}
		page.classList.add("active");
	} else if (active == true) {
		// do nothing
	}
};

function showMobileMenu(source) {
	var button = document.getElementById(source);
	var page = document.getElementById("supMobileMenu");
	var active = button.classList.contains('active');
	
	if (active == false) {
		page.style.visibility = "visible";
		page.style.right = "0px";
		button.classList.add("active");
		var toggle = document.getElementById('mobileMenuToggle');
		toggle.innerHTML = "close";
	} else if (active == true) {
		page.style.right = "";
		window.setTimeout(function(){ page.style.visibility = "hidden";}, 250);
		button.classList.remove('active');
		var toggle = document.getElementById('mobileMenuToggle');
		toggle.innerHTML = "menu";
		
		
	}
};





var supSideArr = [
	['firstBox', 'supSideMenu01'],
	['secondBox', 'supSideMenu02'],
	['thirdBox', 'supSideMenu03']
];


// for naming and assigning popup content for counties
var popupCountyArr = [
	['countyLink1', 'Gov Website', 3],
	['countyLink2', 'Web Map URL', 4],
	['countyLink3', 'Web Map Other', 5],
	['countyLink4', 'Web Map State', 6],
	['countyLink5', 'Comp Plan', 7],
	['countyLink6', 'Haz Mit Plan', 8],
	['countyLink7', 'Climate Plan', 9],
	['countyLink8', 'Resilience Plan', 10],
	['countyLink9', 'Zoning URL', 11]
];

// for naming and assigning popup content for points
var popupPointArr = [
	['pointLink1', 'Govt Web', 3],
	['pointLink2', 'Map Web', 4],
	['pointLink3', 'Comp Plan', 5],
	['pointLink4', 'Zoning Web', 6],
	['pointLink5', 'Haz Mit Web', 7],
	['pointLink6', 'Sus Plan', 8],
	['pointLink7', 'Cli Plan', 9],
	['pointLink8', 'Res Plan', 10]
];

// for naming and assigning popup content for urban polygons
var popupPolyArr = [
	['polyLink1', 'Govt Web', 3],
	['polyLink2', 'Map Web', 4],
	['polyLink3', 'Comp Plan', 5],
	['polyLink4', 'Zoning Web', 6],
	['polyLink5', 'Haz Mit Web', 7],
	['polyLink6', 'Sus Plan', 8],
	['polyLink7', 'Cli Plan', 9],
	['polyLink8', 'Res Plan', 10]
];

var recentClickArr = [];		// stores recent clicks
var storedEClicked = [];		// stores recent clicked data
var storedTypeClicked = [];		// stores recent click type

var uiMenuArr = [
	['firstBox', 'firstCircle', 'searchPage', 'searchPageToggle'],
	['secondBox', 'secondCircle', 'basemapPage', 'basemapPageToggle'],
	['thirdBox', 'thirdCircle', 'filterPage', 'filterPageToggle'],
	['null', 'null', 'featurePage', 'featurePageToggle']
];


/* original
var colorPal = [
	"#2c7bb6",
	"#abd9e9",
	"#fdae61",
	"#d7191c"
];
*/

/* second 
var colorPal = [
	"#003744",
	"#1A554F",
	"#FDA856",
	"#F6FE91"
];
*/

/* third 
var colorPal = [
	"#225ea8",
	"#41b6c4",
	"#a1dab4",
	"#ffffcc"
];
*/

// array that stores colors for map and legend
var colorPal = [
	["#003744", "bubble01"],
	["#41b6c4", "bubble02"],
	["#a1dab4", "bubble03"],
	["#ffffcc", "bubble04"]
];

// initiate colors for legend
document.getElementById(colorPal[0][1]).style.background = colorPal[0][0];
document.getElementById(colorPal[1][1]).style.background = colorPal[1][0];
document.getElementById(colorPal[2][1]).style.background = colorPal[2][0];
document.getElementById(colorPal[3][1]).style.background = colorPal[3][0];

var circleInterval;		// stores interval variable
var maxRadius = 30;
var minRadius = 15;
var radiusControl = false;
var newRadius;

var remove;		// search panel
var remove2;	// search control











