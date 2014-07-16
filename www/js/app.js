var app = angular.module('pecologApp', ['ngResource','ui.router', 'pecologApp.controllers']);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/map");
  $stateProvider
  .state("map", {
    url: "^/map",
    views: {
      contentView: {
        templateUrl: "templates/map.html",
        controller: "MapController"
      }
    },
    resolve: {
      ShopService: 'ShopService',
      shops: function (ShopService) {
        return ShopService.all().$promise;
      }
    }
  });
}]);
