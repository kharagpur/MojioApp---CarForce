import Ember from 'ember';

export default Ember.Controller.extend({
    data: null,

    loginData: null,

    hideButton : false,

    client: null,

    Users: function (){
        return new client.model('User')
    },



    actions: {
            getUser: function(){
                //alert("getUser");
                //client.getMojioUsers();
                this.set("hideButton", true);

                var users, user, div;
                client.get(User, {}, function(error, result){
                    if (error){
                        alert("Error occured when retreving users");
                    }
                    else{
                        //users = client.getResults(User, result);
                        //user = users[0];
                        this.drawTable(users);
                        this.set('userData', result);
                        //self.set('data', 'kennethw@moj.io');
                    }
                });




                //$("#getUserButton").remove();
            }
    },

    drawTable: function(data) {
        alert("hello");
        // for (var i = 0; i < data.length; i++) {
        //     if(i===0){// Setup table header
        //         setupTableHeaders(data[0].Type);
        //         //use handlebar to send data
        //     }
        //     drawRow(i+1,data[i]);
        // }
    },

    init: function(){
        this._super();
        var self = this;

        (function() {
            var User, Vehicle, Trip, config, mojio_client;

            config = {
                application: '57f7998d-bc18-4974-ab9c-149aaac8f194',
                hostname: 'api.moj.io',
                version: 'v1',
                port: '443',
                scheme: 'https',
                redirect_uri: 'http://localhost:4200/',
                live: false
            };

            mojio_client = new MojioClient(config);

            User = mojio_client.model('User');
            Vehicle = mojio_client.model('Vehicle');
            Trip = mojio_client.model('Trip');

            (function() {
                var div;
                //self.set('data', 'Application Written by:');
                if (config.application === 'Your-Application-Key-Here') {
                    div = document.getElementById('result');
                    div.innerHTML += 'Mojio Example Error:: Set your application key in authorize.coffee/authorize.js.  ';
                    return;
                }
                if (config.redirect_uri === 'Your-Authorize-redirect_url-Here') {
                    div = document.getElementById('result');
                    div.innerHTML += 'Mojio Example Error:: Set the authorize redirect url in the config object in authorize.coffee/authorize.js and register it in your application at the developer center.  ';
                    return;
                }
                return mojio_client.token(function(error, result) { //Authentication
                    if (error) {
                        //if (confirm("A token is not available, you are logged out. Press ok to login.")) {
                            return mojio_client.authorize(config.redirect_uri);
                        //}
                    }
                    else {
                            window.location.hash="";
                            //drawTable([result]);
                            self.set("loginData", result);
                            // $("#").click(function(){
                            //     getUsers();
                            //     $("#getUserButton").remove();
                            // });
                            self.set("client", mojio_client);
                            $("#getVehicleButton").click(function(){
                                getVehicles();
                                $("#getVehicleButton").remove();
                            });
                    }
                });
            })();



            function getMojioUsers(){
                var users, user, div;
                mojio_client.get(User, {}, function(error, result){
                    if (error){
                        alert("Error occured when retreving users");
                    }
                    else{
                        users = mojio_client.getResults(User, result);
                        //user = users[0];
                        drawTable(users);
                        self.set('data', 'kennethw@moj.io');
                    }
                });
            }

            function getVehicles(){
                var vehicle, vehicles, div;
                mojio_client.get(Vehicle, {limit:500}, function(error, result) {
                    if (error) {
                        alert("Error: occured when retreving vehicles");
                    }
                    else{
                        vehicles = mojio_client.getResults(Vehicle, result);
                        //vehicle = vehicles[0];
                        drawTable(vehicles);
                    }
                });
            }

            function drawTable(data) {
                for (var i = 0; i < data.length; i++) {
                    if(i===0){// Setup table header
                        setupTableHeaders(data[0].Type);
                    }
                    drawRow(i+1,data[i]);
                }
            }

            function setupTableHeaders(dataType){
                var div,i,row;
                if (dataType === 'Token'){
                    var table = $('<table class="table table-striped table-bordered table-hover"></table>').attr('id', 'tokenDataTable');
                    row = $('<tr><th>ApplicationId</th><th>TokenId</th><th>ValidUntil</th></tr>');
                    table.append(row);
                    $('#result1').append(table);
                }
                if (dataType === 'User'){
                    var table = $('<table class="table table-striped table-bordered table-hover"></table>').attr('id', 'userDataTable');
                    row = $('<tr><th>UserId</th><th>UserName</th><th>Email</th></tr>');
                    table.append(row);
                    $('#result2').append(table);
                }
                if (dataType === 'Vehicle'){
                    var table = $('<table class="table table-striped table-bordered table-hover"></table>').attr('id', 'vehicleDataTable');
                    row = $('<tr><th>Number</th><th>VehicleId</th><th>VIN</th><th>FaultDetected</th></tr>');
                    table.append(row);
                    $('#result3').append(table);
                    //$('#vehicleDataType').css('border', '1px solid black');
                }
            }

            function drawRow(counter, rowData) {
                if(rowData.Type === 'Token'){
                    var row = $("<tr />");
                    $("#tokenDataTable").append(row);
                    row.append($("<td>" + rowData.AppId + "</td>"));
                    row.append($("<td>" + rowData._id + "</td>"));
                    row.append($("<td>" + rowData.ValidUntil + "</td>"));
                }
                if(rowData.Type==='User'){
                    var row = $("<tr />");
                    $("#userDataTable").append(row);
                    row.append($("<td>" + rowData._id + "</td>"));
                    row.append($("<td>" + rowData.UserName + "</td>"));
                    row.append($("<td>" + rowData.Email + "</td>"));
                }
                if(rowData.Type==='Vehicle'){
                    var row = $("<tr />");
                    var faultDetected = rowData.FaultsDetected;
                    var vin = rowData.VIN;
                    var dtc, dtcTable, dtcTableRow;
                    $("#vehicleDataTable").append(row);
                    row.append($("<td>" + counter + "</td>"));
                    row.append($("<td>" + rowData._id + "</td>"));

                    if (vin === undefined){
                        vin = 'N/A';
                    }
                    row.append($("<td>" + vin + "</td>"));
                    if (faultDetected === true){
                        row.addClass('danger');
                        row.attr('id', rowData._id);
                        dtc = rowData.DiagnosticCodes;
                        dtcTable = $('<table class="table table-striped table-bordered table-hover"></table>');
                        dtcTableRow = $('<tr><th>Code</th><th>Description</th><th>Details</th><th>Severity</th></tr>');
                        dtcTable.append(dtcTableRow);
                        for(var i=0; i<dtc.DiagnosticCodes.length; i++)
                        {
                            dtcTableRow = $('<tr><th>'+ dtc.DiagnosticCodes[i].Code +'</th><th>'+ dtc.DiagnosticCodes[i].Description +'</th><th>'+ dtc.DiagnosticCodes[i].Details +'</th><th>'+ dtc.DiagnosticCodes[i].Severity +'</th></tr>');
                            dtcTable.append(dtcTableRow);
                        }
                        row.append(dtcTable);
                    }
                    else
                    {
                        row.append($("<td>" + faultDetected + "</td>"));
                    }
                }
            }

            function getDtc(vehicleId, element){
                var vehicle, vehicles, div;
                mojio_client.get(Vehicle, {limit:100}, function(error, result) {
                    if (error) {
                        alert("Error: occured when retreving vehicles");
                    }
                    else{
                        vehicles = mojio_client.getResults(Vehicle, result);
                        //vehicle = vehicles[0];
                        drawTable(vehicles);
                    }
                });
            }
        }).call(this);
    }
});
