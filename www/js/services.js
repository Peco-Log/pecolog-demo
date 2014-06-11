angular.module('ionic.example.services', [])
.factory('ShopService', function() {
    var shops = new Array();
    shops.push({ z: 35.665270,   x: 139.712330,   content: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"});
    shops.push({ z: 35.66231350, x: 139.70742530, content: "fuge"});
    shops.push({ z: 35.66726010, x: 139.70893330, content: "fuga"});
    shops.push({ z: 35.66358290, x: 139.71174990, content: "muga"});
    return {
      all: function() {
        return shops;
      },
      get: function(shopId) {
        return shops[shopId];
      }
    }
});
