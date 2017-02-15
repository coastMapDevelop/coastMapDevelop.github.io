




















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
};

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


/*var recentClickArr = [];*/	// stores recent clicks - (not in use)
/*var storedEClicked = [];*/	// stores recent clicked data - (not in use)
/*var storedTypeClicked = [];*/	// stores recent click type - (not in use)

var uiMenuArr = [
	['firstBox', 'firstCircle', 'searchPage', 'searchPageToggle'],
	['secondBox', 'secondCircle', 'basemapPage', 'basemapPageToggle'],
	['thirdBox', 'thirdCircle', 'filterPage', 'filterPageToggle'],
	['null', 'null', 'featurePage', 'featurePageToggle'],
	['null', 'supBottomMenu', 'infoPage', 'infoPageToggle']
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






var remove;		// search panel
var remove2;	// search control














