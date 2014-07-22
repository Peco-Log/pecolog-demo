angular.module('pecologApp.controllers', ['ionic','pecologApp.services'])
.controller('MenuController', function ($scope, $ionicSideMenuDelegate, MenuService) {
  $scope.list = MenuService.all();
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
.controller('MapController', function($scope, $ionicLoading, $ionicActionSheet, $state, shops) {
  var initialize = function() {

    var markerDataList = [];
    var comments = ['うまい', 'まずい'];
    _(shops._objs).each(function(shop) {
      markerDataList.push({ z: shop._coord[1],   x: shop._coord[0],   content: shop.name,  comment: comments.shift() });
    });

    var latlng = new google.maps.LatLng(shops._objs[0]._coord[1], shops._objs[0]._coord[0]);
    var mapOptions = {
      center: latlng,
      zoom: 16,
      maxWidth:250,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var img = new google.maps.MarkerImage(
      'img/peco3.png',
      new google.maps.Size(50.0, 60.0),
      new google.maps.Point(0, 0),
      new google.maps.Point(25.0, 60.0)
    );

    _(markerDataList).each(function(markerData) {
      var marker = new google.maps.Marker({
        //position: data[i].position, /* マーカーを立てる場所の緯度・経度 */
        position: new google.maps.LatLng(markerData.z, markerData.x),
        map: map, /*マーカーを配置する地図オブジェクト */
        icon: img
      });
      var infowindow = new google.maps.InfoWindow({
        content: markerData.content + ":" + markerData.comment,
        position: new google.maps.LatLng(markerData.z, markerData.x),
        disableAutoPan: true
      });
      attachMessage(marker, infowindow);
    });

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    new LongPress(map, 500);
    google.maps.event.addListener(map, 'longpress', function(e) {
      var marker = new google.maps.Marker({
        position: e.latLng,
        map: map,
        icon: img
      });
      registorShop(marker);
    });

    $scope.map = map;
    $scope.img = img;
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

  var attachMessage = function(marker, infowindow, ionicActionSheet) {
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

  var registorShop = function(marker, ionicActionSheet, state) {
    $ionicActionSheet.show({
      titleText: 'ショップ登録',
      buttons: [
        { text: '登録する'}
      ],
      cancelText: 'Cancel',
      cancel: function() {
        marker.setMap(null);
      },
      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        return true;
      },
      buttonClicked: function() {
        $state.go("register", {z:marker.position.k, x:marker.position.B});
        return true;
      }
    });
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
      var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      var marker = new google.maps.Marker({
        position: latlng, /* マーカーを立てる場所の緯度・経度 */ 
        map: $scope.map, /*マーカーを配置する地図オブジェクト */
        icon: $scope.img
      });
      var infowindow = new google.maps.InfoWindow({
        content: "I'm here:Hi!",
        position: latlng,
        disableAutoPan: true
      });
      attachMessage(marker, infowindow);
      google.maps.event.addDomListener(window, 'load', initialize);
      $scope.map.setCenter(latlng);
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
.controller('AvatarsController', function ($scope, AvatarsService) {
    $scope.avatars = AvatarsService.avatars;
})
.controller('AboutUsController', function ($scope) {
})
;
