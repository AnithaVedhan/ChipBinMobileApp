
startercontrollers
.controller('MainCtrl', function($scope,$ionicSideMenuDelegate,$rootScope,$state) 
            {

      $scope.toggleLeft = function() {
      
       $ionicSideMenuDelegate.toggleRight();
      };
    

$rootScope.ShowExport=function(){
    if( $rootScope.InAnalyticsTab)
    {
     $state.go("main.tabs.export-Analytics");
    }
    else if($rootScope.InBinDetailsTab|$rootScope.InCustomDetailsTab)
    {
            $state.go("main.tabs.export-BinDetails");
    }
    };
    
$scope.displaytab= function(){
    if (localStorage.getItem('role')==='["Admin"]') {
        
        return "ng-show";
        //$scope.EnableAnalytics = false;

     
    } else {
        return "ng-hide";
    }
}

if(localStorage.getItem('role')==='["Admin"]')
{
$rootScope.ShowExportFlage=true;
}
    else
{
    $rootScope.ShowExportFlage=false;
}

});