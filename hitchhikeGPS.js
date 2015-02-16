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
      "lat": currentPosition.coords.latitude,
      "long": currentPosition.coords.longitude
    };

    $.ajax({
      url:"https://mochilero-api.herokuapp.com/hitchs",
      type:"POST",
      data: JSON.stringify(reqBody),
      contentType:"application/json",
      success: function() {
        console.log('successfully saved');
      }
    });
  });
}

function initializeMap(hitchs) {
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    },
    disableDefaultUI: true
  };

  var mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        { "saturation": -83 },
        { "lightness": 7 }
      ]
    }
  ];

  var styledMap = new google.maps.StyledMapType(mapStyle,
    {name: "Styled Map"});

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  var pointArray = new google.maps.MVCArray(hitchs);
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
  });

  heatmap.set('radius', 25);
  heatmap.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
