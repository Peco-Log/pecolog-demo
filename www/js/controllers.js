angular.module('pecologApp.controllers', ['ionic','pecologApp.services'])
.controller('MenuController', function ($scope, $ionicSideMenuDelegate, MenuService) {
  $scope.list = MenuService.all();
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
.controller('MapController', function($scope, $ionicLoading, $ionicActionSheet, $state, shops, MapService, $ionicModal, $rootScope) {
  var initialize = function() {

    var markerDataList = [];
    var comments = ['うまい', 'まずい'];
    _(shops._objs).each(function(shop) {
      markerDataList.push({ z: shop._coord[1],   x: shop._coord[0],   name: shop.name,  comment: comments.shift() });
    });
    /* map中心の緯度・経度 */
    var latLng = new google.maps.LatLng(shops._objs[0]._coord[1], shops._objs[0]._coord[0]);
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
      $rootScope.$on('attachMessage',attachMessage(marker, infowindow));
    });

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    new LongPress(map, 500);
    google.maps.event.addListener(map, 'longpress', function(e) {
      var marker = MapService.marker();
      marker.setPosition(e.latLng);
      marker.setMap(map);
      $rootScope.marker = marker;
      $scope.modal.show();
    });

    setModalFunction();
    $scope.map = map;
  };
  
  function LongPress(map, length) {
    this.length_ = length;
    var me = this;
    me.map_ = map;
    me.timeoutId_ = null;
    google.maps.event.addListener(map, 'mousedown', function(e) {
      me.onMouseDown_(e);
    });
    google.maps.event.addListener(map, 'mouseup', function(e) {
      me.onMouseUp_(e);
    });
    google.maps.event.addListener(map, 'drag', function(e) {
      me.onMapDrag_(e);
    });
  };

  LongPress.prototype.onMouseUp_ = function(e) {
    clearTimeout(this.timeoutId_);
  };

  LongPress.prototype.onMouseDown_ = function(e) {
    clearTimeout(this.timeoutId_);
    var map = this.map_;
    var event = e;
    this.timeoutId_ = setTimeout(function() {
      google.maps.event.trigger(map, 'longpress', event);
    }, this.length_);
  };

  LongPress.prototype.onMapDrag_ = function(e) {
    clearTimeout(this.timeoutId_);
  };

  var attachMessage = function(marker, infowindow) {
    google.maps.event.addListener(marker, "click", function() {
      var contents = infowindow.getContent().split(":");
      $ionicActionSheet.show({
        titleText: contents[0],
        buttons: [
          { text: contents[1]},
        ],
        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          return true;
        }
      });
    });
  };

  var setModalFunction = function() {
      $ionicModal.fromTemplateUrl('templates/modal.tmpl.html', function(modal) {
        $scope.modal = modal;
      }, {
        animation: 'slide-in-up',
        foucusFirstInput: true
      });
  }
  
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
.controller('RegisterController', function ($scope, $stateParams) {
  $scope.z = $stateParams.z;
  $scope.x = $stateParams.x;
})
.controller('ModalCtrl', function($scope, $rootScope, $ionicActionSheet) {
  $scope.newShop = {}; 
  $scope.createShop = function() {
    var z = $rootScope.marker.position.k;
    var x = $rootScope.marker.position.B;
    console.log('Create Content', $scope.newShop);
    var infowindow = new google.maps.InfoWindow({
      content: $scope.newShop.name + ":" + $scope.newShop.comment,
      position: new google.maps.LatLng(z, x),
      disableAutoPan: true
    });
    //$rootScope.$emit('attachMessage', $rootScope.marker, infowindow);
    attachMessage($rootScope.marker, infowindow); 
    $scope.modal.hide();
  };
  $scope.cancel = function() {
    $scope.modal.hide();
    $rootScope.marker.setMap(null);
  };
  var attachMessage = function(marker, infowindow) {
    google.maps.event.addListener(marker, "click", function() {
      var contents = infowindow.getContent().split(":");
      $ionicActionSheet.show({
        titleText: contents[0],
        buttons: [
          { text: contents[1]},
        ],
        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          return true;
        }
      });
    });
  };
})
.controller('AvatarsController', function ($scope, AvatarsService) {
    $scope.avatars = AvatarsService.avatars;
})
.controller('AboutUsController', function ($scope) {
})
;
