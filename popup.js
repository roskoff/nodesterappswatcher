// The root URL for the RESTful services
var urlAPI = "http://nodester.com/apps";

function getApps() {
	console.log('getApps');
    var user = $("#user").val();
    var pass = $("#pass").val();
	$.ajax({
		type: 'GET',
		url: urlAPI,
		dataType: "json", // data type of response
        "beforeSend": function(xhr) {
            //May need to use "Authorization" instead
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

	$.each(list, function(index, app) {
        $("#appsList").append(
            $("<li>").append("<a href=\"http://"+app.name+".nodester.com\" target=\"_blank\">"+app.name+"</a> - "+app.running+"</li>"));
        console.log(app.name+' - '+app.running);
	});
}

function renderError(xhr, err){
    if (xhr.status === 401){
        $("#appsList").append("<p>Couldn't get any app :(</p>");
        $("#appsList").append("<p><span>You should check the configuration tab!<span></p>");
        console.log(xhr.responseText);
    } else {
        $("#appsList").append("<p>Couldn't get any app :(You should check the config tab!</p>");
        $("#appsList").append("<p><span>Problem: " + xhr.responseText + "<span></p>");
        console.log(xhr.responseText);
    }
}

function saveConfiguration() {
    var user = $("#user").val();
    var pass = $("#pass").val();
    // Save it using the Chrome extension storage API.
    chrome.storage.local.set({'user': user, 'pass': pass}, function() {
        // Notify that we saved.
        message('Settings saved');
        });
}

getApps();
