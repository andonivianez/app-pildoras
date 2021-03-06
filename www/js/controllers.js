var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localstorage, $ionicLoading, LoginService, $state, $rootScope, $http, $ionicPopup, $cordovaToast) {



  $scope.platform = ionic.Platform.platform();
  //console.log($scope.platform);

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$ionicView.enter', function(e) {
//hay que hacer que la primera vez, guarde en localstorage los datos del usuario, y que cada vez que entre renueve el token.

    if(Object.keys($localstorage.getObject('login')).length == 0){ //si no hay datos de login le lanzamos desde 0
      // Form data for the login modal
      $scope.loginData = {};
      //console.log($scope.modal);
      $scope.modal.show();
    }else if(Object.keys($localstorage.getObject('pills')).length == 0){ //si hay datos de login, vamos a por el token
      //si ya tenemos datos de login... pero el token debe ser renovado siempre.
      var ctoken = $localstorage.getObject('token');
      //console.log(ctoken);
      $scope.loginData = $localstorage.getObject('login');
      console.log($scope.loginData);
      $scope.continueToCourses(ctoken);
    }else{
      //si ya estoy dentro no hago nada
    }
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.submit = function () {
    $scope.modal.hide();
    $localstorage.setObject('login', $scope.loginData);
    var user = {_username: $scope.loginData.username, _password: $scope.loginData.password};
      var responsedata;
      delete $http.defaults.headers.common['X-Requested-With'];
    $http
      .post('http://app-pildoras.tak.es/app_dev.php/api/login_check', user)
      .success(function (data) {
        responsedata = data;
        //console.log(responsedata);
        $scope.continueToCourses(responsedata);
      })
      .error(function (data) {
        // Erase the token if the user fails to log in
        //delete $window.sessionStorage.token;
        console.log("Algo ha ido mal: "+data); 
        $scope.showToast('Nombre de usuario/contraseña incorrectos', 'long', 'bottom');
        $localstorage.clear();
        $scope.modal.show();
      });
  };

  $scope.continueToCourses = function(token){
    $timeout(function() {
          //si consigue el token cerramos y le llevamos a la página principal.
        if(!angular.isUndefined(token)){
          $localstorage.setObject('token', token);
          //console.log("Hola estoy aquí ");
          $scope.showToast('Conexión correcta', 'long', 'bottom');
          //alert("Aquí lo tienes crack!: "+token.token);
          //si tenemos token, habría que lanzar la carga de píldoras primero antes de ir a la página principal
          $state.go('app.courses');
        }else{
          Materialize.toast('Nombre de usuario y contraseña incorrecto', 3000) // 4000 is the duration of the toast
          $state.go('loading');
          $scope.modal.show();
        }
      }, 3000);
  }


    // A confirm dialog
     $scope.logout = function() {//esto falta poner popup de los buenos
       var confirmPopup = $ionicPopup.confirm({
        title: 'Desconexión del usuario',
        template: '¿Estás seguro de que deseas desconectar?',
        cssClass: 'courseBackgroundPopUp', // String, The custom CSS class name
        //template: '<a>Estoy es una prueba de lo que saldría</a>', // String (optional). The html template to place in the popup body.
        cancelText: 'Cancelar', // String (default: 'Cancel'). The text of the Cancel button.
        cancelType: 'backgroundPopUpDownloadButtons', // String (default: 'button-default'). The type of the Cancel button.
        okText: 'Aceptar', // String (default: 'OK'). The text of the OK button.
        okType: 'backgroundPopUpDownloadButtons' // String (default: 'button-positive'). The type of the OK button.
       });
       confirmPopup.then(function(res) {
         if(res) {
            $localstorage.clear();
            $state.go('loading');
            $scope.modal.show();
         } 
       });
     };

    ////////CREAMOS LAS MODALES PARA EL HISTORIAL Y EL VER MÁS TARDE/////////////
    ///////////HISTORIAL///////////
    $ionicModal.fromTemplateUrl('templates/historial.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.historyModal = modal;
    });

    $scope.historyModalOpen = function(){
     // $state.go('settings');
      $scope.historyModal.show();
    }
    $scope.historyModalClose = function(){
     // $state.go('settings');
      $scope.historyModal.hide();
    }

    //////////VERMASTARDE////////////
    $ionicModal.fromTemplateUrl('templates/vermastarde.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.laterModal = modal;
    });
    $scope.laterModalOpen = function(){
      //$state.go('settings');
      $scope.datapill= $rootScope.detail_pill;
      $scope.laterModal.show();
    }
    $scope.laterModalClose = function(){
      //$state.go('settings');
      $scope.laterModal.hide();
    }
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.laterModal.remove();
      $scope.historyModal.remove();
    });



    $scope.ajustes = function(){
      $state.go('settings');
    }

     
    $scope.categories = $rootScope.categories;
    //console.log($scope.categories);

    //mensajes toast Cordova
    $scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
    }


})

app.controller('CoursesCtrl', function($http,$scope, $sce, $stateParams, $ionicPopup, $rootScope, $ionicPopover, $ionicHistory, $state, LoginService, $localstorage, $ionicModal, $ionicFilterBar) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $scope.pills = []
    $scope.pill = {}
    $rootScope.detail_pill = {};
    $rootScope.categories = [];
    $scope.sortBy = '';


    $scope.offlineChange = function() {
      console.log('Push Notification Change', $scope.offline.checked);
    };

    //esto es para fijarlo
    $scope.offline = { checked: false };
    
    //Get each pill data
    $scope.getEachPill = function(pillList){

      var cats = [];

      for (var i = 0; i < pillList.length; i++) { 
            cats[i] = {'desc': pillList[i].category[0].name}
      }

      $rootScope.categories = cats;

    }

    $scope.setSort = function(){

    }



    $scope.loadCourses = function(){
        var ctoken = $localstorage.getObject('token');
        var token = "Bearer "+ctoken.token;
        //console.log(token);
        delete $http.defaults.headers.common['X-Requested-With'];
        $http
          .get('http://app-pildoras.tak.es/app_dev.php/api/pills.json',{
              headers:{
                  'Authorization': token,
              }
          }).success(function (data) {
                $localstorage.setObject('pills', data.pills);
                $scope.pills = $localstorage.getObject('pills');
                console.log($scope.pills);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.getEachPill($scope.pills);
              });          
    }; 


    $scope.getCourseById = function(id){
      $rootScope.selectedPill = id;
      angular.forEach($scope.pills, function(value, key) {
        //console.log(value.id)
        if (value.id == id){
            $rootScope.detail_pill[id] = value;
        }
      });   
      //console.log("Esto debería verse una sola vez: "+$rootScope.detail_pill);
      $state.go('single');
    }

    //nada más entrar en la pantalla...
    $scope.$on('$ionicView.loaded', function(e) {
        $scope.loadCourses();
    });


    /* SECCION RATING; DEJAMOS MARCA EN MASTER */
    $scope.ratingsObject  = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star-outline',
        iconOnColor: 'rgb(200, 200, 100)',
        iconOffColor:  'rgb(200, 100, 100)',
        rating:  2,
        minRating:1,
        callback: function(rating) {
          $scope.ratingsObject (rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
      };

      //filterbar
      $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.pills,
          update: function (filteredItems, filterText) {
            $scope.pills = filteredItems;
            if (filterText) {
              console.log(filterText);
            }
          }
        });
      };

      $scope.refreshItems = function () {
        if (filterBarInstance) {
          filterBarInstance();
          filterBarInstance = null;
        }
        $timeout(function () {
          loadCourses();
          $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
      };


    /*PopOver*/
      // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });


    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };


    $scope.readOnly = true;

})

app.controller('CourseCtrl', function($scope, $stateParams, $sce, $rootScope, $ionicPopup, $location, $state, $ionicHistory, $ionicModal, $localstorage, $http) {

   // console.log($ionicHistory.viewHistory());
    $scope.datapill= $rootScope.detail_pill;
    //console.log($scope.datapill);


    //cada vez que entre metemos la pill en el historial
    if(Object.keys($localstorage.getObject('historial')).length == 0){
      $rootScope.historial = [];
    }else{
      $rootScope.historial.push($scope.datapill);
      $localstorage.setObject('historial', $rootScope.historial);
      console.log($rootScope.historial);
    }
    
    $scope.selectedPill = $rootScope.selectedPill;
    $scope.selectedTest = $scope.datapill[$scope.selectedPill].test;
    $scope.historial = $rootScope.historial;
    //console.log("El elegido esssssss: "+$scope.selectedPill)
    //videoplayer params

    $scope.videoLink = $scope.datapill[$scope.selectedPill].translations.es.video_url;
    console.log("Link al video "+$scope.videoLink);
    $scope.clipSrc = $sce.trustAsResourceUrl($scope.videoLink);
    $scope.myPreviewImageSrc = $scope.datapill[$scope.selectedPill].translations.es.image_url;
    $scope.resource_size = $scope.datapill[$scope.selectedPill].translations.es.resource_size;
    $scope.comentarios = $scope.datapill[$scope.selectedPill].comment;

    console.log($scope.comentarios);

    $scope.backgroundDownload = function(){ //está la info en marcadores
      var confirmPopup = $ionicPopup.confirm({
      //  title: '', // String. The title of the popup.
        cssClass: 'courseBackgroundPopUp', // String, The custom CSS class name
        //template: '<a>Estoy es una prueba de lo que saldría</a>', // String (optional). The html template to place in the popup body.
        templateUrl: 'templates/popups/backgroundDownload.html', // String (optional). The URL of an html template to place in the popup   body.
        cancelText: 'Cancelar', // String (default: 'Cancel'). The text of the Cancel button.
        cancelType: 'backgroundPopUpDownloadButtons', // String (default: 'button-default'). The type of the Cancel button.
        okText: 'Aceptar', // String (default: 'OK'). The text of the OK button.
        okType: 'backgroundPopUpDownloadButtons', // String (default: 'button-positive'). The type of the OK button.
       //template: 'El archivo seleccionado ocupa '+$scope.datapill[$scope.selectedPill].translations.es.resource_size+' Bytes. <br />¿Quieres tenerlo disponible para sin conexión?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          //console.log($scope.backgroundDownloadToogle.checked)
        } else {
          console.log('You are not sure');
        }
      });
    }
    $scope.dataC = {};
    $scope.addComment = function(pillId){
   
      var myPopup =  $ionicPopup.prompt({
        cssClass: 'courseBackgroundPopUp', 
        templateUrl: 'templates/popups/comentar.html', 
        scope: $scope,
        buttons: [{ 
            text: 'Cancelar',
            type: 'backgroundPopUpDownloadButtons',
            onTap: function(e) {
              // e.preventDefault() will stop the popup from closing when tapped.
            }
          }, {
            text: 'Aceptar',
            type: 'backgroundPopUpDownloadButtons',
            onTap: function(e) {
              //console.log(e);
              //return $scope.dataC.comentario;

            }
          }],
       });

      myPopup.then(function(res) {
         //console.log('Lo escrito essssss', res);
          var ctoken = $localstorage.getObject('token');
          var token = "Bearer "+ctoken.token;
          var comentdata = {message: $scope.dataC.comentario, pill: $scope.selectedPill};
          //console.log($scope.dataC);
          //console.log(token);
          delete $http.defaults.headers.common['X-Requested-With'];
          $http
            .post('http://app-pildoras.tak.es/app_dev.php/api/comment',{
                headers:{
                    'Authorization': token,
                }
            }, comentdata).success(function (data) {
               $scope.showToast('Comentario enviado correctamente', 'long', 'bottom');
            });

       });
    }


    //mensajes toast Cordova
    $scope.showToast = function(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
      console.log("The toast was shown");
      }, function (error) {
      console.log("The toast was not shown due to " + error);
      });
    }

    $scope.startTest = function(pillId){
      $state.go('test', {testId: pillId})
    }
    $scope.openPdf = function(pillId){
      //link tuneado
      console.log("Abrimos el pdf");
        $cordovaFileOpener2.open(
          $scope.datapill[$scope.selectedPill].translations.es.resource_url,
          'application/pdf'
        ).then(function() {
            // file opened successfully
        }, function(err) {
            // An error occurred. Show a message to the user
        });
    }

    $scope.volverACursos = function(){
      //console.log("que pasa")
      ///$location.path("#/app/test/"+pillId);
      $backView = $ionicHistory.backView();
      $backView.go();
      $scope.selectedPill = '';
      $rootScope.selectedPill = '';
    }
    
    //rating
    $scope.max = 5;
    $scope.readOnly = true;
    $scope.rate = $scope.datapill[$scope.selectedPill].rating_static;
    console.log($scope.rate);

    //meter video al historial
    $scope.videoControls = function(){this.paused?this.play():this.pause();}

});

app.controller('SearchCtrl', function($scope, $stateParams) {
  console.log($stateParams)

});

app.controller('TestCtrl', function($scope, $stateParams, $rootScope, $state) {
  console.log($stateParams)
  $scope.datapill= $rootScope.detail_pill;

  $scope.process = 'prevtest';

  $scope.beginTest = function(){
    $scope.process = 'testing';
  }
  $scope.testClean = function(){
    $scope.process = 'prevtest';
  }
  $scope.endTest = function(){
    $scope.process = 'endtest';
     $state.go('app.courses');
  }

  $scope.validateTest = function(){
    //bien estático
    $scope.isOk = true;
     $timeout(function() {
        //abrimos y cerramos a los 3 segundos
        $scope.isOk = false;   
    }, 3000);
  }

});

app.controller('SettingsCtrl', function($scope, $stateParams, $ionicHistory, $translate, $cordovaToast) {
  console.log($stateParams)
  $ionicHistory.clearHistory();
  $scope.toggleLang = function (lang) {
        console.log(lang);
       $translate.use(lang);
       console.log($translate.use());
  }

  $scope.sendMessage = function (){
    //Materialize.toast('Mensaje enviado correctamente', 3000) // 4000 is the duration of the 
    $scope.showToast('Mensaje enviado correctamente', 'long', 'bottom');
  }

  //mensajes toast Cordova
  $scope.showToast = function(message, duration, location) {
    $cordovaToast.show(message, duration, location).then(function(success) {
    console.log("The toast was shown");
    }, function (error) {
    console.log("The toast was not shown due to " + error);
    });
  }



});

/*Services*/

app.factory('LoginService',['$http',function($http){

     return {
       getAllPills:function(receivedToken){
        var token = "Bearer"+receivedToken.token;
        console.log(token);
        delete $http.defaults.headers.common['X-Requested-With'];
        console.log(token);
          $http
            .get('http://app-pildoras.tak.es/app_dev.php/api/pills.json',{
                headers:{
                    'Authorization': token,
                }
            }).success(function (data) {
                console.log(data);
            })
        }/* ,
        get:function(id){
            return $http.get('https://api.parse.com/1/classes/Todo/'+id,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                }
            });
        },
        create:function(data){
            return $http.post('https://api.parse.com/1/classes/Todo',data,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type':'application/json'
                }
            });
        },
        edit:function(id,data){
            return $http.put('https://api.parse.com/1/classes/Todo/'+id,data,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type':'application/json'
                }
            });
        },
        delete:function(id){
            return $http.delete('https://api.parse.com/1/classes/Todo/'+id,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type':'application/json'
                }
            });
        }*/
    }
}]);


app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});


/* LocalStorage */
app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    clear: function () {
            $window.localStorage.clear();
    }
  }
}]);


/*     Directivas        */
app.directive('videoplayer', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/video_popover.html'
  }
});

app.directive('prevtest', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/prev_test.html'
  }
});

app.directive('testing', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/testing.html'
  }
});

app.directive('endtest', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/last_test.html'
  }
});

app.directive('pdfviewer', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/pdfviewer.html'
  }
});

app.directive('comentarios', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/comentarios.html'
  }
});