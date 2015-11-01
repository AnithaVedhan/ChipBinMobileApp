startercontrollers.controller('loginCtrl', function ($scope, LoginService, $ionicPopup, $state, $cordovaOauth, $rootScope,$ionicHistory) {
    $scope.data = {};
 
   $scope.login = function() {

       if($scope.data.username != undefined && $scope.data.password  != undefined)

       {

       LoginService.loginUser($scope.data.username, $scope.data.password).then(function(data) {

           console.log(data);

           if(data != '')

              {

            $rootScope.test="T";

           localStorage.setItem('role',JSON.stringify(data));
         $ionicHistory.clearCache().then(function(){ $state.go('main.tabs.dash')})
           

              }

           else

           {

           alert("Please Enter Correct Credentials");

           }

       })

       }

       else

       {

           alert("Please Enter All Credentials");

       }

    }
    
    $scope.GmailLogin = function () {
        //224958831701 - goh20ucfj9unu4vqa350i3cd9ohjjkhd.apps.googleusercontent.com
        $cordovaOauth.google("224958831701-goh20ucfj9unu4vqa350i3cd9ohjjkhd.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function (result) {
           
           $rootScope.test="T";
           localStorage.setItem('role','guest');
           $ionicHistory.clearCache().then(function(){ $state.go('main.tabs.dash')})
           
        }, function(error) {
            console.log(error);
        });
    }

    $scope.FacebookLogin = function () {
        //224958831701 - goh20ucfj9unu4vqa350i3cd9ohjjkhd.apps.googleusercontent.com
        $cordovaOauth.facebook("1648813072065066", ["email"]).then(function (result) {
                   $rootScope.test="T";
                   localStorage.setItem('role','guest');
           $ionicHistory.clearCache().then(function(){ $state.go('main.tabs.dash')})
          
        }, function (error) {
            console.log(error);
        });
    }
})


