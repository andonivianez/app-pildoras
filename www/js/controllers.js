var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localstorage, $ionicLoading, LoginService, $state, $rootScope, $http, $ionicPopup) {

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
        console.log(responsedata);
        $scope.continueToCourses(responsedata);
      })
      .error(function (data) {
        // Erase the token if the user fails to log in
        //delete $window.sessionStorage.token;
        console.log("Algo ha ido mal: "+data); 
        $localstorage.clear();
        $scope.modal.show();
      });
  };

  $scope.continueToCourses = function(token){
    $timeout(function() {
          //si consigue el token cerramos y le llevamos a la página principal.
        if(!angular.isUndefined(token)){
          $localstorage.setObject('token', token);
          console.log("Hola estoy aquí ");
          //alert("Aquí lo tienes crack!: "+token.token);
          //si tenemos token, habría que lanzar la carga de píldoras primero antes de ir a la página principal
          $state.go('app.courses');
        }else{
          alert("Usuario/contraseña incorrectos");
          $state.go('loading');
          $scope.modal.show();
        }
      }, 3000);
  }



    // A confirm dialog
     $scope.logout = function() {//esto falta poner popup de los buenos
       var confirmPopup = $ionicPopup.confirm({
        title: 'Desconexión del usuario',
        template: '¿Estás seguro de que deseas desconectar al usuario?',
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

})

app.controller('CoursesCtrl', function($http,$scope, $sce, $stateParams, $ionicPopup, $rootScope, $ionicPopover, $ionicHistory, $state, LoginService, $localstorage, $ionicModal) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $scope.pills = []
    $scope.pill = {}
    $rootScope.detail_pill = {};
    $rootScope.categories = [];



    $scope.offlineChange = function() {
      console.log('Push Notification Change', $scope.offline.checked);
    };

    //esto es para fijarlo
    $scope.offline = { checked: false };
    
    //Get each pill data
    $scope.getEachPill = function(pillList){
        angular.forEach(pillList, function(pill) {
            angular.forEach(pill.category, function(category) {
                  //console.log(category)
                 $rootScope.categories[category.id] = category;
                  //$scope.$apply();

            });
        });
       
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
                //console.log(data.pills);
                $localstorage.setObject('pills', data.pills);
                $scope.pills = $localstorage.getObject('pills');
                //console.log($scope.pills);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.getEachPill($scope.pills);
              });
          console.log("Actualizo Pills");
    }; 


    $scope.getCourseById = function(id){
      $rootScope.selectedPill = id;
      angular.forEach($scope.pills, function(value, key) {
        //console.log(value.id)
        if (value.id == id){
            $rootScope.detail_pill[id] = value;
        }
      });   
      console.log($rootScope.detail_pill);
      $state.go('single');
    }


    $scope.ajustes = function(){
      $state.go('settings');
    }






    //nada más entrar en la pantalla...
    $scope.$on('$ionicView.loaded', function(e) {
        $scope.loadCourses();
    });

    //estrellas
    $scope.max = 5;

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

app.controller('CourseCtrl', function($scope, $stateParams, $sce, $rootScope, $ionicPopup, $location, $state, $ionicHistory, $ionicModal, $localstorage) {

   // console.log($ionicHistory.viewHistory());
    $scope.datapill= $rootScope.detail_pill;
    console.log($scope.datapill);


    //cada vez que entre metemos la pill en el historial
    if(Object.keys($localstorage.getObject('historial')).length == 0){
      $rootScope.historial = [];
    }else{
      $rootScope.historial.push($scope.datapill);
      $localstorage.setObject('historial', $rootScope.historial);
      console.log($rootScope.historial);
    }
    
    $scope.selectedPill = $rootScope.selectedPill;
    console.log("El elegido esssssss: "+$scope.selectedPill)
    //videoplayer params
    $scope.clipSrc = $sce.trustAsResourceUrl($scope.datapill[$scope.selectedPill].translations.es.video_url);
    $scope.myPreviewImageSrc = $scope.datapill[$scope.selectedPill].translations.es.image_url;
    $scope.resource_size = $scope.datapill[$scope.selectedPill].translations.es.resource_size;

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

    $scope.addComment = function(pillId){
       $ionicPopup.prompt({
        cssClass: 'courseBackgroundPopUp', // String, The custom CSS class name
        //template: '<a>Estoy es una prueba de lo que saldría</a>', // String (optional). The html template to place in the popup body.
        templateUrl: 'templates/popups/comentar.html', // String (optional). The URL of an html template to place in the popup   body.
        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
            text: 'Cancelar',
            type: 'backgroundPopUpDownloadButtons',
            onTap: function(e) {
              // e.preventDefault() will stop the popup from closing when tapped.
            }
          }, {
            text: 'Aceptar',
            type: 'backgroundPopUpDownloadButtons',
            onTap: function(e) {
              // Returning a value will cause the promise to resolve with the given value.
              console.log("llamamos a la función para meterlo");
            }
          }],
         inputPlaceholder: 'Escribe aquí'
       }).then(function(res) {
         console.log('Your password is', res);
       });
    }

    $scope.startTest = function(pillId){
      $state.go('test', {testId: pillId})
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

app.controller('TestCtrl', function($scope, $stateParams) {
  console.log($stateParams)

  $scope.process = 'prevtest';

  $scope.beginTest = function(){
    $scope.process = 'testing';
  }
  $scope.testClean = function(){
    $scope.process = 'prevtest';
  }
  $scope.endTest = function(){
    $scope.process = 'endtest';
  }

});

app.controller('SettingsCtrl', function($scope, $stateParams, $ionicHistory) {
  console.log($stateParams)
  $ionicHistory.clearHistory();
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
