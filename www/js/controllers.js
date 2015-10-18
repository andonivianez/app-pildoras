var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $localstorage, $ionicLoading, LoginService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
    //$scope.login();
    $localstorage.setObject('login', {
      username: 'Thoughts',
      password: 'Today was a good day'
    });
    //console.log($localstorage.get('name'));
  });

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
      $scope.loginData = {};
      $ionicLoading.show({
        template: 'Intentado conectar...'
      });

      LoginService.loginUser($scope.loginData.username, $scope.loginData.password).success(function(data) {
        //si la cosa va bien...
          //$state.go('tab.dash');
          console.log(data)
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert(data);
          
      }).error(function(data) {
        //si no...
         /* var alertPopupFail = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
          });*/
        var alertPopupLog = $ionicPopup.alert(data);
        $ionicLoading.hide();
      });
      $timeout(function() {
          //$scope.closeLogin();
        $ionicLoading.hide();
      }, 5000);
  };

  //cargamos las categorias en el menú
  $scope.getCategories = function(){
    $scope.categories = courseData.categories();
    console.log($scope.categories);
  }
  
  $scope.orderCourses = function(){
    //console.log(courseData.order)
    if (courseData.reverse() == true){
      courseData.sort(false)
    }else{
      courseData.sort(true)
    }
    //order = courseData.order;
  }

    // A confirm dialog
     $scope.logout = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Desconexión del usuario',
         template: '¿Estás seguro de que deseas desconectar al usuario?'
       });
       confirmPopup.then(function(res) {
         if(res) {
           $ionicPopup.alert({
             title: 'Desconexión realizada',
             template: 'Gracias por usar esta aplicación.'
           });
         } else {
           console.log('You are not sure');
         }
       });
     };

})

app.controller('CoursesCtrl', function($http,$scope,DataService, $sce, $stateParams, $ionicPopup, $rootScope, $ionicPopover) {
    $scope.pills = []
    $scope.pill = {}
    $rootScope.detail_pill = {};
    $rootScope.categories = [];
    
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
        DataService.getPillCourses().then(function(response){
            $scope.pills = response.pills;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.getEachPill($scope.pills);

        });
    }; 

    $scope.orderCourses = function(){//terminar
     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Por fecha' },
         { text: 'Por Destacados' },
         { text: 'Move' },
         { text: 'Move' }
       ],
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
          },
       buttonClicked: function(index) {
         return true;
       }
     });
    }

    $scope.getCourseById = function(id){
      $rootScope.selectedPill = id;
      angular.forEach($scope.pills, function(value, key) {
        //console.log(value.id)
        if (value.id == id){
            $rootScope.detail_pill[id] = value;
        }
      });   
      console.log($rootScope.detail_pill);
    }

    $scope.addComment = function(pillId){
       $ionicPopup.prompt({
         title: 'Introduce tu comentario',
         //template: 'Escribe aquí',
         //inputType: 'password',
         inputPlaceholder: 'Escribe aquí'
       }).then(function(res) {
         console.log('Your password is', res);
       });
    }

    function toObject(arr) {
      var rv = {};
      for (var i = 0; i < arr.length; ++i)
        if (arr[i] !== undefined) rv[i] = arr[i];
      return rv;
    }

    $scope.$on('$ionicView.enter', function(e) {
        $scope.loadCourses();
    });

    //estrellas
    $scope.rate = 3;
    $scope.max = 5;
    $rootScope.readOnly = true;

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
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });

})

app.controller('CourseCtrl', function($scope, $stateParams, $sce, $rootScope, $ionicPopup) {
    $scope.datapill= $rootScope.detail_pill
    $scope.selectedPill = $rootScope.selectedPill;
    console.log("El elegido esssssss: "+$scope.selectedPill)
    //videoplayer params
    $scope.clipSrc = $sce.trustAsResourceUrl($scope.datapill[$scope.selectedPill].translations.es.video_url);
    $scope.myPreviewImageSrc = $scope.datapill[$scope.selectedPill].translations.es.image_url;
    //end videoplayer params
    $scope.video = function() {
        var videoElements = angular.element(document.querySelector('#player'));
        videoElements[0].pause();
    }

    $scope.backgroundDownload = function(){ //está la info en marcadores
      var confirmPopup = $ionicPopup.confirm({
       //title: 'Ver más tarde',
       template: 'El archivo seleccionado ocupa'+$scope.datapill[$scope.selectedPill].translations.es.resource_size+' MB. <br />¿Quieres tenerlo disponible para sin conexión?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
    }

   // $location.path("/home");

});

app.controller('SearchCtrl', function($scope, $stateParams) {
  console.log($stateParams)

});

app.controller('TestCtrl', function($scope, $stateParams) {
  console.log($stateParams)

  $scope.process = 'prevtest';

});

/*Services*/

app.service('DataService', function($http, $q) {
  var pillCourses = $q.defer();

    $http.get('data/response.json').then(function(response) {
        pillCourses.resolve(response.data);
    });

    this.getPillCourses = function() {
        return pillCourses.promise;
    };
});

app.service('LoginService', function($q, $http) {
    return {
        loginUser: function(name, pw) {
            var taklogin = $q.defer();
            var promise = taklogin.promise;
            $http.post("http://app-pildoras.tak.es/app_dev.php/api/login_check", {_username: name, _password: pw}).then(function(response) {
              console.log("Respuesta del backend"+response.data)
                taklogin.resolve(response.data);
            });
            //taklogin.reject('Wrong credentials.');

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})


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