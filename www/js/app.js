var app = angular.module('pecologApp', ['ngResource','ui.router', 'pecologApp.controllers']);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/map");
  $stateProvider
  .state("map", {
    url: "^/map",
    views: {
      contentView: {
        templateUrl: "templates/map.tmpl.html",
        controller: "MapController"
      }
    },
    resolve: {
      ShopService: 'ShopService',
      shops: function (ShopService) {
        return ShopService.all().$promise;
      }
    }
  })
  .state("avatars", {
    url: "^/avatars",
    views: {
      contentView: {
        templateUrl: "templates/avatars.tmpl.html",
        controller: "AvatarsController"
      }
    }
  })
  .state("aboutUs", {
    url: "^/aboutUs",
    views: {
      contentView: {
        templateUrl: "templates/aboutUs.tmpl.html",
        controller: "AboutUsController"
      }
    }
  });
}]);
