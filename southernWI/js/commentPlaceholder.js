
//Google Spreadsheet API for secure access
//Example: if authentication is required for non-public spreadsheets

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '770051880602-cn6ju1h9ci99n6slh2etehoc453v4546.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

      
//Check if current user has authorized this application.
       
function checkAuth() {
	gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
};

      
// Handle response from authorization server.
//
// @param {Object} authResult Authorization result.
       
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadSheetsApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
};

     
// Initiate auth flow in response to user clicking authorize button.
//
// @param {Event} event Button click event.
       
function handleAuthClick(event) {
    gapi.auth.authorize({
		client_id: CLIENT_ID, scope: SCOPES, immediate: false},handleAuthResult);
		return false;
};