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
    _(shops._objs).each(function(shop) {
      markerDataList.push({ z: shop.latitude, x: shop.longitude, id: shop._id, name: shop.name});
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
      infowindow.setContent(markerData.name);
      infowindow.setPosition(localLatLng);
      ModalService.attachMessage($scope, marker, infowindow,
        'templates/message.tmpl.html', null, markerData.id, 'ugagod');
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
.controller('NewShopModalController', function($scope, $rootScope, MapService, CreateShopService,  $ionicActionSheet, ModalService) {
  $scope.newShop = {}; 
  $scope.createShop = function() {
    var z = $rootScope.marker.position.k;
    var x = $rootScope.marker.position.B;
    var name = $scope.newShop.name;
    var newComment = $scope.newShop.comment;
    var deferred = CreateShopService.save(x, z, name, newComment);
    var localLatLng = new google.maps.LatLng(z, x);

    var infowindow = MapService.infowindow();
    infowindow.setContent(name);
    infowindow.setPosition(localLatLng);

    deferred.then(function(data) {
      ModalService.attachMessage($scope, $rootScope.marker,
        infowindow, 'templates/message.tmpl.html', newComment, data._id, data.user_id);
    });

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
