﻿/*  MyNetSensors 
    Copyright (C) 2015 Derwish <derwish.pro@gmail.com>
    License: http://www.gnu.org/licenses/gpl-3.0.txt  
*/

$.noty.defaults.layout = 'bottomRight';
$.noty.defaults.theme = 'relax';
$.noty.defaults.timeout = 3000;
$.noty.defaults.animation = {
    open: 'animated bounceInRight', // Animate.css class names
    close: 'animated flipOutX', // Animate.css class names
    easing: 'swing', // unavailable - no need
    speed: 500 // unavailable - no need
};

var gatewayHub;
var gatewayHardwareConnected = false;
var gatewayServiceConnected = false;

var nodesCount;
var sensorsCount;


$(function () {
    gatewayHub = $.connection.gatewayHub;

    gatewayHub.client.onGatewayHardwareConnected = function () {
        var n = noty({ text: 'Gateway hardware is online.', type: 'alert', timeout: false });
        gatewayHardwareConnected = true;
        gatewayStatusChanged();
    };

    gatewayHub.client.onGatewayHardwareDisconnected = function () {
        var n = noty({ text: 'Gateway hardware is offline!', type: 'error', timeout: false });
        gatewayHardwareConnected = false;
        gatewayStatusChanged();
    };

    gatewayHub.client.onGatewayServiceConnected = function () {
        var n = noty({ text: 'Gateway service is online.', type: 'alert', timeout: false });
        gatewayServiceConnected = true;
        gatewayStatusChanged();
        gatewayHub.server.getGatewayHardwareConnected();
    };

    gatewayHub.client.onGatewayServiceDisconnected = function () {
        var n = noty({ text: 'Gateway service is offline!', type: 'error', timeout: false });
        gatewayServiceConnected = false;
        gatewayHardwareConnected = false;
        gatewayStatusChanged();
    };

    gatewayHub.client.returnGatewayServiceConnected = function (isConnected) {
        gatewayServiceConnected = isConnected;
        gatewayStatusChanged();
        gatewayHub.server.getGatewayHardwareConnected();
    };


    gatewayHub.client.returnGatewayHardwareConnected = function (isConnected) {
        gatewayHardwareConnected = isConnected;
        gatewayStatusChanged();
    };

    gatewayHub.client.onClearNodesListEvent = function (sensor) {
        var n = noty({ text: 'Nodes deleted from the database!', type: 'error' });
    };



   
    

    gatewayHub.client.returnNodes = function (nodes) {
        onReturnNodes(nodes);
    };

    gatewayHub.client.onNewNodeEvent = function (node) {
        nodesCount++;
        updateNodesAndSensorsCounts();
    };
    
    gatewayHub.client.onNewSensorEvent = function (sensor) {
        sensorsCount++;
        updateNodesAndSensorsCounts();
    };

 
    gatewayHub.client.returnConnectedUsersCount = function (count) {
        $('#users-online').text(count);
    };

    gatewayHub.client.returnGatewayInfo = function (gatewayInfo) {
        nodesCount = gatewayInfo.gatewayNodesRegistered;
        sensorsCount = gatewayInfo.gatewaySensorsRegistered;
        updateNodesAndSensorsCounts();
    };


    $.connection.hub.start().done(function () {
        gatewayHub.server.getGatewayServiceConnected();
        gatewayHub.server.getGatewayInfo();
        gatewayHub.server.getConnectedUsersCount();
        setInterval(updateData, 1000);
    });

});


function updateData() {
    gatewayHub.server.getConnectedUsersCount();
}




function gatewayStatusChanged() {
    if (gatewayHardwareConnected) {
        $('#gateway-hardware-online').html("<p class='text-success'>Gateway hardware is online <span class='glyphicon glyphicon-ok' aria-hidden='true'></span></p>");
    } else {
        $('#gateway-hardware-online').html("<p class='text-danger'>Gateway hardware is offline <span class='glyphicon glyphicon-remove' aria-hidden='true'></span></p>");
    }

    if (gatewayServiceConnected) {
        $('#gateway-service-online').html("<p class='text-success'>Gateway service is online <span class='glyphicon glyphicon-ok' aria-hidden='true'></span></p>");
    } else {
        $('#gateway-service-online').html("<p class='text-danger'>Gateway service is offline <span class='glyphicon glyphicon-remove' aria-hidden='true'></span></p>");
    }

    if (gatewayHardwareConnected && gatewayServiceConnected)
        $('#gateway-info').fadeIn(300);
    else
        $('#gateway-info').fadeOut(300);
}



function onReturnNodes(nodes) {
    $('#nodesContainer').html(null);

    nodesCount = 0;
    if (nodes != null) nodesCount = nodes.length;

    sensorsCount = 0;
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            sensorsCount += nodes[i].sensors.length;
        }
    }
    updateNodesAndSensorsCounts();
}

function updateNodesAndSensorsCounts() {
    $('#nodes-registered').html(nodesCount);
    $('#sensors-registered').html(sensorsCount);
}