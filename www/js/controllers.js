angular.module('pecologApp.controllers', ['ionic','pecologApp.services'])
.controller('MenuController', function ($scope, $ionicSideMenuDelegate, MenuService) {
  $scope.list = MenuService.all();
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.closeMenu = function () {
    $ionicSideMenuDelegate.isOpen();
  };
})
.controller('MapController', function($scope, $ionicLoading, $ionicActionSheet, shops) {
  var initialize = function() {

    var data = new Array();
    data.push({ z: shops._objs[0]._coord[1],   x: shops._objs[0]._coord[0],   content: shops._objs[0].name,  comment: "うまい！"});
    data.push({ z: shops._objs[1]._coord[1],   x: shops._objs[1]._coord[0],   content: shops._objs[1].name,  comment: "まずい！"});

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
    for (i = 0; i < data.length; i++) {
      var marker = new google.maps.Marker({
        //position: data[i].position, /* マーカーを立てる場所の緯度・経度 */
        position: new google.maps.LatLng(data[i].z, data[i].x),
        map: map, /*マーカーを配置する地図オブジェクト */
        icon: img
      });
      var infowindow = new google.maps.InfoWindow({
        content: data[i].content + ":" + data[i].comment,
        position: new google.maps.LatLng(data[i].z, data[i].x),
        disableAutoPan: true
      });

      $scope.map = map;
      $scope.img = img;
      //$scope.marker = marker;
      //$scope.infowindow = infowindow;
    };
  }
  google.maps.event.addDomListener(window, 'load', initialize);

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
  }

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
.controller('AvatarsController', function ($scope) {
})
.controller('AboutUsController', function ($scope) {
})
;
