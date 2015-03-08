// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ortho' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ortho.services' is found in services.js
// 'ortho.controllers' is found in controllers.js
angular.module('ortho', ['ionic', 'ngMaterial', 'ngSanitize'])
.directive('keyboardHandler', function ($window) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            angular.element($window).bind('native.keyboardshow', function() {
                element.addClass('tabs-item-hide');
            });

            angular.element($window).bind('native.keyboardhide', function() {
                element.removeClass('tabs-item-hide');
            });
        }
    };
})
.run(["$ionicPlatform", function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}]);