'use strict';

angular.module('hitchhikeGPS.controllers')

.controller('HitchsCtrl', ['$scope', 'hitchs', function($scope, hitchs) {

  var DEFAULT_POSITION = {

  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.updateHitchs(position);
    });
  } else {
    $scope.updateHitchs(DEFAULT_POSITION);
  }

  /**
    * Fetchs the hitchs near the given position and updates the map
    */
  $scope.updateHitchs = function(position) {
    hitchs.query().$promise.then(function (results) {
      $scope.updateHeatMap(_.map(results, function(hitch) {
        return new google.maps.LatLng(hitch.lat, hitch.long);
      }), position);
    });
  };

  $scope.initializeMap = function(position) {
    var mapOptions = {
      zoom: 5,
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
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

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    $scope.map.mapTypes.set('map_style', styledMap);
    $scope.map.setMapTypeId('map_style');
  }

  $scope.updateHeatMap = function(sample, position) {
    if (! $scope.map ) {
      $scope.initializeMap(position);
    }

    var pointArray = new google.maps.MVCArray(sample);
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });

    heatmap.set('radius', 25);
    heatmap.setMap($scope.map);
  };
}]);
