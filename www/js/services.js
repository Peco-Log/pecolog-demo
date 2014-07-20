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
.factory('ShopService', function ($resource, $q) {
  var SHOP_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/shop/';
  return {
    all: function () {
      return $resource(SHOP_BASE_URL + '-', {get: {method: 'GET'}}).get();
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
  return {avatars: avatars}
});
