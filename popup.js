// The root URL for the RESTful services
var urlAPI = "http://nodester.com/apps";

function getApps() {
    loadConfiguration();
	console.log('getApps');
    var user = $("#user").val();
    var pass = $("#pass").val();
	$.ajax({
		type: 'GET',
		url: urlAPI,
		dataType: "json",
        "beforeSend": function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass))
            },
		success: renderList,
        error: renderError
	});
}

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
    console.log("List: " + list);
    $("#appsList").empty();
	$.each(list, function(index, app) {
        $("#appsList").append(
            $("<li>").append("<a href=\"http://"+app.name+".nodester.com\" target=\"_blank\">"+app.name+"</a> - "+app.running+"</li>"));
        console.log(app.name+' - '+app.running);
	});
}

function renderError(xhr, err){
    var appsList = $("#appsList");
    appsList.empty();
    appsList.append("<p>Couldn't get any app :(</p>");
    if (xhr.status === 401){
        appsList.append("<p><span>You should check the configuration tab!<span></p>");
    } else {
        appsList.append("<p>Unable to connect with nodester.com</p>");
    }
    console.log(xhr.readyState);
    console.log(xhr.status);
    console.log(xhr.responseText);
}

function saveConfiguration() {
	console.log('saveConfiguration');
    localStorage.user = $("#user").val();
    localStorage.pass = $("#pass").val();
}

function loadConfiguration() {
	console.log('loadConfiguration');
    $("#user").val(localStorage.user); 
    $("#pass").val(localStorage.pass); 
}

function saveAndUpdate(){
    saveConfiguration();
    getApps();
}
