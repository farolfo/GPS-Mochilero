"use strict";

var map, pointarray, heatmap, currentPosition;

function initialize() {

  if(!navigator.geolocation) {
    window.location.assign("error.html?geolocationFailed=true");
    return;
  }

  //gets the curret position
  navigator.geolocation.getCurrentPosition(function(position) {

    currentPosition = position;

    // fetch hitchs
    $.get("https://mochilero-api.herokuapp.com/hitchs", function( data ) {
      initializeMap(_.map(data, function(hitch) {
        return new google.maps.LatLng(hitch.lat, hitch.long);
      }));
      allowActions();
    });
  });
}

function allowActions() {
  $('#addHichhike').click(function() {
    var reqBody = {
      lat: currentPosition.coords.latitude,
      long: currentPosition.coords.longitude
    };

    $.post("https://mochilero-api.herokuapp.com/hitchs", reqBody,
      function() {
        console.log('successfully saved');
      }, "json");
  });
}

function initializeMap(hitchs) {
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    zoomControl: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var pointArray = new google.maps.MVCArray(hitchs);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
  });

  heatmap.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
