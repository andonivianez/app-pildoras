var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
    $scope.login();
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
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

    $timeout(function() {
        $scope.closeLogin();
    }, 1000);
  };

  //cargamos las categorias en el menú
  $scope.getCategories = function(){
    $scope.categories = courseData.categories();
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

app.controller('CoursesCtrl', function($http,$scope,DataService, $sce) {
    $scope.pills = []
    $scope.pill = {}
    $scope.categories = []

    //Get each pill data
    function getEachPill(pillList) {
        angular.forEach(pillList, function(value, key) {
          $scope.pill = value;
          //console.log($scope.pill)
          angular.forEach($scope.pill.category, function(value, key) {
            //console.log(value)
            if ($scope.categories.indexOf(value.name) == -1){
                $scope.categories.push(value.name)
            }
            console.log($scope.categories)
          });
        });
    }

    $scope.loadCourses = function(){
        /* //console.log($scope.order)
           // console.log($scope.courses)*/
        DataService.getPillCourses().then(function(response){
            $scope.pills = response.pills;
            $scope.$broadcast('scroll.refreshComplete');
            getEachPill($scope.pills);
        });
    }; 

    $scope.orderCourses = function(){
        console.log($scope.order)
        $scope.order = {
          reverse: true
        };
    }

    $scope.$on('$ionicView.enter', function(e) {
        $scope.loadCourses();
        //console.log("hola");
    });

    //estrellas
    $scope.rate = 3;
    $scope.max = 5;
    $scope.readOnly = true;

})

app.controller('CourseCtrl', function($scope, $stateParams, $sce) {
    $scope.clipSrc = $sce.trustAsResourceUrl('https://s3-eu-west-1.amazonaws.com/takweb/news/038_gasnatural.mp4');
    $scope.myPreviewImageSrc = "http://www.miscocheselectricos.com/archivos/tesla-model-s-sunset-628-1354200468.jpg";
     
    $scope.video = function() {
        var videoElements = angular.element(document.querySelector('#player'));
        videoElements[0].pause();
    }

});

app.controller('SearchCtrl', function($scope, $stateParams) {
  console.log($stateParams)

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