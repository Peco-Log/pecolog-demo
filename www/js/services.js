var COMMENT_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/comment/';
var SHOP_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/shop/';

angular.module('pecologApp.services', ['pecologApp.models'])
.factory('MenuService', function () {
  var menuItems = [
    { text: 'Map', iconClass: 'icon ion-map', colour: "candy-purple-bg", link: 'map()'},
    { text: 'Friends', iconClass: 'icon ion-person-stalker', colour: "candy-pink-bg", link: 'avatars()'},
    { text: 'Setting', iconClass: 'icon ion-gear-b', colour: "candy-yellow-bg", link: 'about()'}
  ];
  return {
    all: function () {
      return menuItems;
    }
  };
})
.factory('ShopService', function ($resource) {
  return {
    all: function () {
      return $resource(SHOP_BASE_URL + '-', {get: {method: 'GET'}}).get();
    }
  };
})
.factory('CommentService', function ($resource, $q, $http) {
  var TOKEN = 'app5aeb8f6e4ddf1b9e892f855672'; 
  var CONTENT_TYPE = 'application/json';
  var deferred = new $q.defer();
  return {
    all: function (shop_id) {
      return $resource(COMMENT_BASE_URL + '-;shop_id.eq.' + shop_id, {get: {method: 'GET'}}).get();
    },
    usr: function (shop_id, user_id) {
      return $resource(COMMENT_BASE_URL + '-;shop_id.eq.' + shop_id + ';user_id.eq.' + user_id, {get: {method: 'GET'}}).get();
    },
    save: function(shop_id, comment) {
      $http({
        method: 'POST',
        url: COMMENT_BASE_URL + '?get=true',
        headers: {
          'X-APPIARIES-TOKEN': TOKEN,
          'Content-Type': CONTENT_TYPE},
        data: {
          shop_id: shop_id,
          comment: comment,
          user_id: 'ugagod'
        }
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }); 
      return deferred.promise;
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
.factory('ModalService', function ($ionicModal, $ionicActionSheet, CommentService, UpdateModel) {
  return {
    attachMessage: function($scope, marker, infowindow, url, newComment, shop_id, user_id) {
      $ionicModal.fromTemplateUrl(url, function(modal) {
        $scope.messageModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up',
        foucusFirstInput: true
      });
      google.maps.event.addListener(marker, "click", function() {
        UpdateModel.updateComment = "";
        UpdateModel.commentFlg = false;
        $scope.title = infowindow.getContent();
        $scope.newCommentFlg = newComment;
        $scope.newComment = newComment;
        $scope.img = 'http://ionicframework.com/img/docs/venkman.jpg';
        $scope.name = 'Venkman';
        $scope.comments = CommentService.all(shop_id);
        CommentService.usr(shop_id, user_id).$promise.then(
          function(data) {
            if (data._objs[0]) {
              UpdateModel.commentFlg = true;
              UpdateModel.updateComment = data._objs[0].comment;
            }
          }
        );
        $scope.messageModal.show();
        $scope.id = shop_id;
        $scope.user_id = user_id;
        $scope.updateModel = UpdateModel;
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
.factory('CreateShopService', function ($q, $http) {
  var TOKEN = 'app5aeb8f6e4ddf1b9e892f855672'; 
  var CONTENT_TYPE = 'application/json';
  var deferred = new $q.defer();
  return {
    save: function(x, z, name, comment) {
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
          url: COMMENT_BASE_URL + '?get=true',
          headers: {
            'X-APPIARIES-TOKEN': TOKEN,
            'Content-Type': CONTENT_TYPE},
          data: {
            shop_id: data._id,
            comment: comment,
            user_id: 'ugagod'
          }
        }).success(function(data, status, headers, config) {
          deferred.resolve(data);
        }); 
      });
      return deferred.promise;
    }
  }
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
