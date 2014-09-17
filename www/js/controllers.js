angular.module('pecologApp.controllers', ['ionic','pecologApp.services'])
.controller('MenuController', function ($scope, $ionicSideMenuDelegate, MenuService) {
  $scope.list = MenuService.all();
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
.controller('MapController', function($scope, $ionicLoading, $ionicActionSheet, $state, shops, MapService, ModalService, $ionicModal, $rootScope) {
  var initialize = function() {

    var markerDataList = [];
    var comments = ['うまい', 'まずい'];
    _(shops._objs).each(function(shop) {
      markerDataList.push({ z: shop.latitude,   x: shop.longitude,   name: shop.name,  comment: comments.shift() });
    });
    /* map中心の緯度・経度 */
    var latLng = new google.maps.LatLng(shops._objs[2].latitude, shops._objs[2].longitude);
    var map = MapService.map();
    map.setCenter(latLng);

    _(markerDataList).each(function(markerData) {
      var localLatLng = new google.maps.LatLng(markerData.z, markerData.x);
      /* 各マーカーの立てる場所の緯度・経度 */
      var marker = MapService.marker();
      marker.setPosition(localLatLng);
      marker.setMap(map);
      /* ショップへのコメント */
      var infowindow = MapService.infowindow();
      infowindow.setContent(markerData.name + ":" + markerData.comment);
      infowindow.setPosition(localLatLng);
      ModalService.attachMessage($scope, marker, infowindow, 'templates/message.tmpl.html');
    });

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    google.maps.event.addListener(map, 'click', function(e) {
      var marker = MapService.marker();
      marker.setPosition(e.latLng);
      marker.setMap(map);
      $rootScope.marker = marker;
      $scope.newShopModal.show();
    });

    ModalService.setModalFunction($scope, 'templates/newShop.tmpl.html');
    $scope.map = map;
  };

  google.maps.event.addDomListener(window, 'load', initialize());

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      var myPositionMarker = MapService.myPositionMarker();
      myPositionMarker.setPosition(latLng);
      myPositionMarker.setMap($scope.map);
      google.maps.event.addDomListener(window, 'load', initialize);
      $scope.map.setCenter(latLng);
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };
})
.controller('MessageModalController', function ($scope) {
  $scope.cancel = function() {
    $scope.messageModal.hide();
  };
})
.controller('NewShopModalController', function($scope, $http, $rootScope, $ionicActionSheet, ModalService) {
  $scope.newShop = {}; 
  var SHOP_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/shop';
  var COMMENT_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/comment';
  var TOKEN = 'app5aeb8f6e4ddf1b9e892f855672'; 
  var CONTENT_TYPE = 'application/json';
  $scope.createShop = function() {
    var z = $rootScope.marker.position.k;
    var x = $rootScope.marker.position.B;
    var name = $scope.newShop.name;
    var comment = $scope.newShop.comment;
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: SHOP_BASE_URL + '?get=true',
      headers: {
        'X-APPIARIES-TOKEN': TOKEN,
        'Content-Type': CONTENT_TYPE},
      data: {
        name: name,
        latitude: z,
        longitude: x
      }}).success(function(data, status, headers, config) {
        $http({
          method: 'POST',
          url: COMMENT_BASE_URL,
          headers: {
            'X-APPIARIES-TOKEN': TOKEN,
            'Content-Type': CONTENT_TYPE},
          data: {
            shop_id: data._id,
            comment: comment
          }
        });
      });

    var infowindow = new google.maps.InfoWindow({
      content: name + ":" + comment,
      position: new google.maps.LatLng(z, x),
      disableAutoPan: true
    });
    ModalService.attachMessage($scope, $rootScope.marker, infowindow, 'templates/message.tmpl.html'); 
    $scope.modal.hide();
    $scope.newShop = {};
  };
  $scope.cancel = function() {
    $scope.modal.hide();
    $scope.newShop = {};
    $rootScope.marker.setMap(null);
  };
})
.controller('AvatarsController', function ($scope, AvatarsService) {
    $scope.avatars = AvatarsService.avatars;
})
.controller('AboutUsController', function ($scope) {
})
;
