// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ionic.service.push','ngCordova', 'starter.controllers', 'jett.ionic.filter.bar', 'pascalprecht.translate', 'ngIOS9UIWebViewPatch', 'ionic-ratings'])

.run(function($ionicPlatform, $localstorage, $translate) {
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

if(typeof navigator.globalization !== "undefined") {
    navigator.globalization.getPreferredLanguage(function(language) {
        $translate.use((language.value).split("-")[0]).then(function(data) {
            console.log("SUCCESS -> " + data);
        }, function(error) {
            console.log("ERROR -> " + error);
        });
    }, null);
}

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $translateProvider) {
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

  .state('test', {
    url: '/test',
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
  $httpProvider.defaults.headers.post = { 'Content-Type' : 'application/json' };
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('authInterceptor');

////////////////TRANSLATIOONNSSS///////
$translateProvider.translations('es', {
    'AJUSTES': 'Configuración',
    'NOTIFICACIONES': 'Notificaciones',
    'IDIOMA': 'Idioma',
    'CONTACTO': 'Contacto',
    'AVISOLEGAL': 'Aviso legal',
    'ACERCADE': 'Acerca de',
    'VERMASTARDE': 'Ver más tarde',
    'SINCONEXION': 'Sin conexión',
    'HISTORIAL': 'Historial',
    'CONFIGURACION': 'Configuración',
    'DESCONECTAR': 'Desconectar',
    'IDIOMA': 'Idioma',
    'COMENZAR' : 'Comenzar',
    'TEST' : 'Test',
    'CONTACTO': 'Contacto',
    'ENVIAR': 'Enviar',
    'ESCRIBASUMENSAJE': 'Escriba su mensaje aquí',
    'CONLACOLABORACIONDE': 'Con la colaboración de: ',
    'DESARROLLADOPOR': 'Desarrollado por: ',
    'DISPONIBLESINCONEXION': 'Disponible sin conexión',
    'ACCEDER': 'Acceder',
    'HELPACCEDER': 'Necesito ayuda para acceder',
    'NOMBREUSUARIO': 'Nombre de usuario',
    'CONTRASEÑA': 'Contraseña',
    'DESCRIPCION': 'Descripción',
    'COMENTARIOS': 'Comentarios',
    'ESCRIBEAQUITUCOMENTARIO': 'Escribe aquí tu comentario',
  });
 
  $translateProvider.translations('eu', {
    'AJUSTES': 'Ezarpenak',
    'NOTIFICACIONES': 'Oharrak',
    'IDIOMA': 'Hizkuntza',
    'CONTACTO': 'Kontaktua',
    'AVISOLEGAL': 'Lege oharra',
    'ACERCADE': 'Honi buruz',
    'VERMASTARDE': 'Geroago ikusi',
    'SINCONEXION': 'Konexiorik gabe',
    'HISTORIAL': 'Ikusitak',
    'CONFIGURACION': 'Ezarpenak',
    'DESCONECTAR': 'Irten',
    'IDIOMA': 'Hizkuntza',
    'COMENZAR': 'Hasi',
    'TEST': 'Galdesorta',
    'CONTACTO': 'Kontaktua',
    'ENVIAR': 'Bidali',
    'ESCRIBASUMENSAJE': 'Idatzi hemen zure mezua',
    'CONLACOLABORACIONDE': 'Laguntzailea: ',
    'DESARROLLADOPOR': 'Egilea: ',
    'DISPONIBLESINCONEXION': 'Konexiorik gabe',
    'ACCEDER': 'Sartu',
    'HELPACCEDER': 'Laguntza behar dut',
    'NOMBREUSUARIO': 'Erabiltzailea',
    'CONTRASEÑA': 'Pasahitza',
    'DESCRIPCION': 'Deskribapena',
    'COMENTARIOS': 'Iruzkinak',
    'ESCRIBEAQUITUCOMENTARIO': 'Idatzi zure iruzkina',
  });
 
  $translateProvider.preferredLanguage('es'); //idioma por defecto


});

