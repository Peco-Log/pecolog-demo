angular.module('pecologApp.services', [])

.factory('MenuService', function () {
  var menuItems = [
    { text: 'Map', iconClass: 'icon ion-map', colour: "candy-purple-bg", link: '#/map'},
    { text: 'Frends', iconClass: 'icon ion-person-stalker', colour: "candy-pink-bg", link: '#/program'},
    { text: 'About', iconClass: 'icon ion-woman', colour: "candy-yellow-bg", link: '#/about'}
  ];

  return {
    all: function () {
      return menuItems;
    }
  }
})

.factory('ShopService', function ($resource, $q) {
  var SHOP_BASE_URL = 'https://api-datastore.appiaries.com/v1/dat/_sandbox/pecolog/shop/';
  return {
    all: function () {
      return $resource(SHOP_BASE_URL + '-', {get: {method: 'GET'}}).get();
    }
  }
});
