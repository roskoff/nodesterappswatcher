// The root URL for the RESTful services
var urlAPI = "http://nodester.com";

function getApps() {
    loadConfiguration();
	console.log('getApps');
    var user = $("#user").val();
    var pass = $("#pass").val();

    showProgress();

	$.ajax({
		type: 'GET',
		url: urlAPI + "/apps",
		dataType: "json",
        "beforeSend": function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass))
            },
		success: renderList,
        error: renderError
	});
}

function showProgress(){
    $("#appsList").append('<div style="width: 16px; margin: 0 auto;"><img id="progress" src="img/ajax-loader.gif"> </div>');
}

function hideProgres(){
 $("#progress").hide();
}

function getServerStatus() {
	console.log('getServerStatus');
	$.ajax({
		type: 'GET',
		url: urlAPI + "/status",
		dataType: "json",
		success: renderStatus,
        error: renderServerError
	});
}

function renderList(data) {

    hideProgres();

	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
    console.log("List: " + list);
    var appsList = $("#appsList");
    appsList.empty();
    appsList.append(
        '<div class="span12">' +
            '<div class="row-fluid">' +
                '<div class="span6"><h4>App Name</h4></div>' +
                '<div class="span6"><h4>Status</h4></div>' +
            '</div>' +
        '</div>');
	$.each(list, function(index, app) {
        appsList.append(
            '<div class="span12">' +
                '<div class="row-fluid">' +
                    '<div class="span6"><a href="http://'+app.name+'.nodester.com" target="_blank">'+app.name+'</a></div>' +
                    '<div class="span6"><img id="img_'+app.name+'" width="24" src="/img/rocket-running-'+app.running+'.png"></div>' +
                '</div>' +
            '</div>');
        var status = app.running === 'true' ? "running! \\m/" : "down :(";
        $("#img_"+app.name).tooltip({"title":"App is " + status, "placement":"right"});//, "content":"this is the content"});
        console.log(app.name+' - '+app.running);
	});
}

function renderStatus(data) {
    var serverStatus = $("#serverStatus");
    var statusLabel = data.status === "up" ? "success" : "important";
    serverStatus.empty();
    serverStatus.append(
        '<div class="well">' +
            '<p><a href="http://nodester.com" target="_blank">Nodester</a> sever status is <span class="label label-'+statusLabel+'">'+data.status.toUpperCase()+'</span>.' +
            ' There are <strong>'+data.appshosted+'</strong> apps hosted and <strong>'+data.appsrunning+'</strong> of them are running.' +
        '</div>');
}

function renderServerError(xhr, err){
    $("#serverStatus").empty();
}

function renderError(xhr, err){
    hideProgres();

    var appsList = $("#appsList");
    appsList.empty();
    var div = '<div class="alert alert-error"><p>Couldn\'t get any app :(</p>';
    if (xhr.status === 401){
        div += '<em>You should check the configuration tab!</em>';
    } else {
        div += '<em>Unable to connect with nodester.com</em>';
    }
    div += '</div>';
    appsList.append(div);
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
    getServerStatus();
}
