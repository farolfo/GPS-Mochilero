"use strict";

var map, pointarray, heatmap;

function initialize() {
  $.get("https://mochilero-api.herokuapp.com/hitchs", function( data ) {
    initializeMap(_.map(data, function(hitch) {
      return new google.maps.LatLng(hitch.lat, hitch.long);
    }));
  });
}

function initializeMap(hitchs) {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(37.774546, -122.433523),
    mapTypeId: google.maps.MapTypeId.ROADMAP
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
