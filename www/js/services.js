angular.module('pecologApp.services', [])

.factory('MenuService', function () {
  var menuItems = [
    { text: 'Map', iconClass: 'icon ion-map', colour: "candy-purple-bg", link: '#/venue'},
    { text: 'Frends', iconClass: 'icon ion-person-stalker', colour: "candy-pink-bg", link: '#/program'},
    { text: 'About', iconClass: 'icon ion-woman', colour: "candy-yellow-bg", link: '#/about'}
  ];

  return {
    all: function () {
      return menuItems;
    }
  }
})
;


