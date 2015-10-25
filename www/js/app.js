// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ionic.service.push','ngCordova', 'starter.controllers', 'ionic-material', 'ionic.rating', 'jett.ionic.filter.bar', 'ionMdInput', 'ionic-cache-src',])

.run(function($ionicPlatform, $localstorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $localstorage.setObject('pills', {});
  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('loading', {
    url: '/loading',
        templateUrl: 'templates/loading.html',
        controller: 'AppCtrl'
  })


  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.test', {
    url: '/test/:testId',
    templateUrl: 'templates/test.html',
    controller: 'TestCtrl'
  })

  .state('settings', {
    url: '/settings',
        templateUrl: 'templates/ajustes/ajustes.html',
        controller: 'SettingsCtrl'
  })


    .state('app.courses', {
      url: '/courses',
      views: {
        'menuContent': {
          templateUrl: 'templates/courses.html',
          controller: 'CoursesCtrl',
          cache: false
        }
      }
    })

  .state('single', {
    url: '/single',
    templateUrl: 'templates/course.html',
    controller: 'CourseCtrl',
    cache: false
  })

   .state('acercade', {
    url: '/acercade',
    templateUrl: 'templates/ajustes/acercade.html',
    controller: 'SettingsCtrl'
  })
   
  .state('avisolegal', {
    url: '/avisolegal',
    templateUrl: 'templates/ajustes/avisolegal.html',
    controller: 'SettingsCtrl'
  })

  .state('contacto', {
    url: '/contacto',
    templateUrl: 'templates/ajustes/contacto.html',
    controller: 'SettingsCtrl'
  })

  .state('idioma', {
    url: '/idioma',
    templateUrl: 'templates/ajustes/idioma.html',
    controller: 'SettingsCtrl'
  })

  .state('notificaciones', {
    url: '/notificaciones',
      templateUrl: 'templates/ajustes/notificaciones.html',
      controller: 'SettingsCtrl'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('loading');

  $ionicConfigProvider.navBar.alignTitle('center');
  //$ionicConfigProvider.views.transition("none");
   $httpProvider.defaults.headers.post = { 'Content-Type' : 'application/json' };
   $httpProvider.defaults.withCredentials = true;
   $httpProvider.interceptors.push('authInterceptor');


});

