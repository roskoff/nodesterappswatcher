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
        success: function(data, status, xhr){
                renderList(data, status, xhr);
            },
        error: renderError
    });
}

function showProgress(){
    $("#appsList").append('<div class="spinner"><img id="progress" src="img/ajax-loader.gif"> </div>');
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

function renderList(data, status, xhr) {
    var list;
    var appsList = $("#appsList");

    hideProgres();

    //uncomment the line below to simulate the error condition.
    //status = "error";
    if(status == "error"){
        appsList.append(
        '<div class="alert alert-error">' +
            '<em>Something seems to have gone wrong with Nodester, please try again later.</em>' +
        '</div>');
        return;
    }

    //uncomment the line below to simulate the Unauthorized condition.
    //xhr.status = 401;
    if(xhr.status === 401){
        appsList.append(
        '<div class="alert alert-error">' +
            '<em>Unable to Authorize. Please re-enter username and password using configuration tab.</em>' +
        '</div>');
        return;
    }

    //uncomment the line below to simulate the Server error condition.
    //xhr.status = 500;
    if(xhr.status === 500){
        appsList.append(
        '<div class="alert alert-error">' +
            '<em>Something seems to have gone wrong with Nodester, please try again later.</em>' +
        '</div>');
        return;
    }
    // The above part can be combined with status='error' condition, 
    //user messages for both of them are same.


    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    list = data == null ? [] : (data instanceof Array ? data : [data]);
    //console.log("List: " + list);
    appsList.empty();
    appsList.append(
        '<div class="span12">' +
            '<div class="row-fluid">' +
                '<div class="span6"><h4>App Name</h4></div>' +
                '<div class="span6"><h4>Status</h4></div>' +
            '</div>' +
        '</div>');
    var appRunning;
    $.each(list, function(index, app) {
        // Double check if app is running, sometimes Nodester API reports the 
        // process is still running, but actually the service is unavailable.
        // See jaydeepw reported issue: https://github.com/roskoff/nodesterappswatcher/issues/2
        $.ajax({
            type: 'GET',
            url: 'http://'+app.name+'.nodester.com/',
            success: function(data, status, xhr){
                var appRunning = app.running === "true" && xhr.status !== "503";
                appRow(appsList, app.name, appRunning);
            },
            error: function(xhr, err){
                appRow(appsList, app.name, false);
            }
        });
    })
}

function appRow(list, name, status){
    list.append(
        '<div class="span12">' +
            '<div class="row-fluid">' +
                '<div class="span6"><a href="http://'+name+'.nodester.com" target="_blank">'+name+'</a></div>' +
                '<div class="span6"><img id="img_'+name+'" width="24" src="/img/rocket-running-'+status+'.png"></div>' +
            '</div>' +
        '</div>');
    var s = status === true ? "running! \\m/" : "down :(";
    $("#img_"+name).tooltip({"title":"App is " + s, "placement":"right"});
    console.log(name+' - '+status);
}

function renderStatus(data) {
    console.log('renderStatus');
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
