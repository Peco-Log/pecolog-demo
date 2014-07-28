angular.module('pecologApp.services', [])

.factory('MenuService', function () {
  var menuItems = [
    { text: 'Map', iconClass: 'icon ion-map', colour: "candy-purple-bg", link: 'map()'},
    { text: 'Friends', iconClass: 'icon ion-person-stalker', colour: "candy-pink-bg", link: 'avatars()'},
    { text: 'About Us', iconClass: 'icon ion-woman', colour: "candy-yellow-bg", link: 'about()'}
  ];
  return {
    all: function () {
      return menuItems;
    }
  };
})
.factory('ShopService', function ($resource) {
  var SHOP_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/shop/';
  return {
    all: function () {
      return $resource(SHOP_BASE_URL + '-', {get: {method: 'GET'}}).get();
    }
  };
})
.factory('MapService', function () {
  var mapOptions = {
    zoom: 16,
    maxWidth:250,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var img = new google.maps.MarkerImage(
    'img/peco3.png',
    new google.maps.Size(50.0, 60.0),
    new google.maps.Point(0, 0),
    new google.maps.Point(25.0, 60.0)
  );
  var myPositionImg = new google.maps.MarkerImage(
    'img/ionic.png',
    new google.maps.Size(100.0, 100.0),
    new google.maps.Point(0, 0),
    new google.maps.Point(50.0, 100.0),
    new google.maps.Size(50, 50)
  );
  return {
    map: function() {
      return new google.maps.Map(document.getElementById("map"), mapOptions);
    },
    marker: function() {
      return new google.maps.Marker({
        icon: img
      });
    },
    infowindow: function() {
      return new google.maps.InfoWindow({
        disableAutoPan: true
      });
    },
    myPositionMarker: function() {
      return new google.maps.Marker({
        icon: myPositionImg
      });
    },
  };
})
.factory('MapCtlrService', function () {
  return {
    longPress: function (map, length) {
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
    }
  };
})  
.factory('AvatarsService', function () {
  var avatars = [
    { img: 'http://ionicframework.com/img/docs/venkman.jpg', name: 'Venkman', mention: "Back off, man. I'm a scientist.", isChecked: true},
    { img: 'http://ionicframework.com/img/docs/spengler.jpg', name: 'Egon', mention: "We're goona go full stream.", isChecked: true},
    { img: 'http://ionicframework.com/img/docs/stantz.jpg', name: 'Ray', mention: "Ugly little spud, isn't he?", isChecked: true},
    { img: 'http://ionicframework.com/img/docs/winston.jpg', name: 'Winston', mention: "That's a big Twinkle.", isChecked: true},
    { img: 'http://ionicframework.com/img/docs/tully.jpg', name: 'Tully', mention: "Okay, who brought the dog?", isChecked: true}
  ];
  return {avatars: avatars};
});
