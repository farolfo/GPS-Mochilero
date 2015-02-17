"use strict";

var map, pointarray, heatmap, currentPosition, bootstrapAlert;

function initialize() {

  if(!navigator.geolocation) {
    window.location.assign("error.html?geolocationFailed=true");
    return;
  }

  bootstrapAlert = function() {};
  bootstrapAlert.success = function(message) {
      $('#alertPlaceholder').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
  }
  bootstrapAlert.error = function(message) {
      $('#alertPlaceholder').html('<div class="alert alert-danger"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
  }

  $('.confirm-add-hitchhike').click(function() {
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
        $('#addHitchhikeConfirm').modal('toggle');
        bootstrapAlert.success('Hitchhike location saved! Thanks for contributing!');
      },
      error: function() {
        $('#addHitchhikeConfirm').modal('toggle');
        bootstrapAlert.success('There was an error while saving the location');
      }
    });
  });

  $('#addHitchhikeConfirm').on('shown.bs.modal', function () {
    if(!navigator.geolocation) {
      $('.getting-geolocation').hide();
      $('.geolocation-failed').show();
      return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      currentPosition = position;

      $('.getting-geolocation').hide();
      $('.geolocation-succeded').show();
      //$('.confirm-add-hitchhike').enable();
    });
  });

  $('#addHitchhikeConfirm').on('hidden.bs.modal', function () {
    $('.getting-geolocation').show();
    $('.geolocation-failed').hide();
    $('.geolocation-succeded').hide();
    //$('.confirm-add-hitchhike').disable();
  });

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
  //$('#addHichhike').enable();
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
