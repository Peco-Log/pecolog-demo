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
.factory('CommentService', function ($resource) {
  var COMMENT_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/comment/';
  return {
    all: function () {
      return $resource(COMMENT_BASE_URL + '-', {get: {method: 'GET'}}).get();
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
        icon: img,
        draggable: true,
        //raiseOnDrag: false,
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
  .factory('ModalService', function ($ionicModal, $ionicActionSheet) {
    return {
      attachMessage: function($scope, marker, infowindow, url) {
        $ionicModal.fromTemplateUrl(url, function(modal) {
          $scope.messageModal = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up',
          foucusFirstInput: true
        });
        google.maps.event.addListener(marker, "click", function() {
          var contents = infowindow.getContent().split(":");
          $scope.title = contents[0];
          $scope.message = contents[1];
          $scope.img = 'http://ionicframework.com/img/docs/venkman.jpg';
          $scope.name = 'Venkman';
          $scope.messageModal.show();
        });
      },
      setModalFunction: function($scope, url) {
        $ionicModal.fromTemplateUrl(url, function(modal) {
          $scope.newShopModal = modal;
        }, {
          animation: 'slide-in-up',
          foucusFirstInput: true
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
