'use strict';

angular.module('hitchhikeGPS.controllers')

.controller('HeaderCtrl', ['$scope', '$modal', function($scope, $modal) {
  $scope.openHitchhikeModal = function() {
    $modal.open({
      templateUrl: 'addHitchhike/addHitchhike.modal.html',
      controller: 'AddHitchhikeCtrl'
    });
  };
}]);
