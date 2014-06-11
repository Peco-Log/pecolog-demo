angular.module('ionic.example.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, ShopService) {
  function initialize() {
    var data = ShopService.all();
    console.log("data:" + data);
    var latlng = new google.maps.LatLng(35.665270, 139.712330);
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
        content: "<div class='message'>" + data[i].content + "</div>",
        position: new google.maps.LatLng(data[i].z, data[i].x),
        //position: data[i].position
        //size: new google.maps.Size(50, 50)
        disableAutoPan: true
      });
      attachMessage(marker, infowindow);
    }
    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    $scope.map = map;
    //$scope.marker = marker;
    //$scope.infowindow = infowindow;
  }
  google.maps.event.addDomListener(window, 'load', initialize);

  function attachMessage(marker, infowindow) {
    google.maps.event.addListener(marker, "click", function() {
      infowindow.open(marker.getMap(), marker);
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
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
