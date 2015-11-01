startercontrollers
.controller('analyticsCtrl', function($scope, Chats, $state,$rootScope,$http,InstagramApiUrl,$filter,$ionicPopup) {
 
    ////Variable declaration
  $rootScope.ShowAnalytics=true;
  $rootScope.ShowBinDetails=false;
  $scope.LocationSearchText=[];
  $scope.chats = $rootScope.myLatLng;
  $scope.filterOption=Chats.allOption();
  $scope.QueryLocation=[];
  $scope.selectedBins=[];
  $scope.ShowDefaultLocation=true;
  $scope.ShowSelectedLocation=false;
  $scope.currentDate = new Date();
  $scope.fromDate = new Date();
  $scope.toDate = new Date();
  $scope.startDate=$scope.fromDate;
  $scope.endDate=$scope.toDate;
    
    ////Code for Date picker
    $scope.datePickerFromCallback = function (val) {
    if (!val) { 
        console.log('Date not selected');
    } else {
        $scope.startDate= val;
    
    }
};
     $scope.datePickerToCallback = function (val) {
    if (!val) { 
        console.log('Date not selected');
    } else {
        $scope.endDate= val;
    }
};
  
    ////To display the analytics details page and pass the selected option to analytics details view
    $scope.doSomething=function(option){
         $scope.SelectedLocation=[];
         $scope.SelectedLocationID=[];
              if(  $scope.ShowDefaultLocation){
        for (var i = 0; i < $scope.chats.length; i++) {
        if ($scope.chats[i].selected) {
          $scope.SelectedLocationID.push($scope.chats[i].BinID);
          $scope.SelectedLocation.push($scope.chats[i]);
             }
        };
                  
              }
        else if( $scope.ShowSelectedLocation)
        {
          for (var i = 0; i < $scope.selectedBins.length; i++) {
        if ($scope.selectedBins[i].selected) {
          $scope.SelectedLocationID.push($scope.selectedBins[i].BinID);
            $scope.SelectedLocation.push($scope.selectedBins[i]);
             }
        };
        }
        
        if($scope.SelectedLocationID.length>0)
        { 
           
           $scope.startDate=$filter('date')( $scope.startDate, 'yyyy-MM-dd');
           $scope.endDate=$filter('date')($scope.endDate, 'yyyy-MM-dd');
                     var dt1 = $scope.startDate.split('-'),
            dt2 = $scope.endDate.split('-'),
            one = new Date(dt1[0], dt1[1], dt1[2]),
            two = new Date(dt2[0], dt2[1], dt2[2]);
        
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = two.getTime() - one.getTime();
        var days = (millisBetween / millisecondsPerDay)+1;
          if(days>1)
            {
                ////For empty trend we can have only 2 bins at a time.
                if(option=='Empty Trend')
                {
                if ($scope.SelectedLocationID.length>2)
                {
                 var alertPopup = $ionicPopup.alert({
                 title:'Number of Selected Bin',
                template: 'Please select only 2 bins for plotting empty trend at a time'
                      });
                }
                    else
                    {
                           $state.go('main.tabs.analytics-detail',{selectedBinsID:$scope.SelectedLocationID,selectedBin:     $scope.SelectedLocation,queryHeader:option,startDate: $scope.startDate,endDate: $scope.endDate});
                    
                    }
                                                    
                }
                else{
                            $state.go('main.tabs.analytics-detail',{selectedBinsID:$scope.SelectedLocationID,selectedBin:     $scope.SelectedLocation,queryHeader:option,startDate: $scope.startDate,endDate: $scope.endDate});
                }
                

            }
         else
         {
                 var alertPopup = $ionicPopup.alert({
                 title:'Error in Date Selection',
                template: 'Please select different From and To Date'
            });
         }
         
        }
        else
        {
             var alertPopup = $ionicPopup.alert({
                 title:'Error in Selecting Bins',
                template: 'Please select Bins'
            });
        }
     
      
    }
    
    ////Search function is called
    $scope.getLocation = function (LocationSearchText) {
        
        if (LocationSearchText.length > 3) {
                $scope.ShowSearch = true;
                $scope.ShowNoRecordsFound = false;
             $scope.QueryPeople = [];
                  //Get data from service
            $scope.getLocationNameOrId(LocationSearchText);
             

          
        }
        else {
            $scope.ShowSearch = false;
            $scope.QueryLocation = [];
            $scope.ShowNoRecordsFound = false;
        }
    };
   
    ////Call to database to get the list of Bins
    $scope.getLocationNameOrId = function (LocationSearchText) {
        $scope.QueryLocation=[];
        $http({
            async: false,
            method: 'GET',
            url:InstagramApiUrl + "/ChipBin/SearchLocation.php?search="+LocationSearchText,
        }).success(function (response) {
            
              for(var i = 0; i < response.length; i++)
                         { array = [];
                          
                         array = response[i].split(',');
                      
                         a = array[0]; b = array[1]; c = array[2]; d = array[3]; e=array[4];                         
                         $scope.QueryLocation.push({ 
                                        BinID : a,
                                        lat : b,
                                        long : c,
                                        Name:d,
                                        BinAddress:e,
                                        selected:false
                                       } );  
                         
                         };
            
            if ($scope.QueryLocation.length != 0) {
                $scope.ShowSearch = true;
                $scope.ShowNoRecordsFound = false;
            }
            else {
                $scope.ShowSearch = false;
                $scope.QueryLocation = [];
                $scope.ShowNoRecordsFound = true;
            }
        }).error(function (response) {
            //TODO: Error message
            alert("Error while recieving data");
        });
    };
    
    ////To display the selected option from search list on ui.
    $scope.selectedLocation = function (location, LocationSearchText) {
     $scope.ShowDefaultLocation=false;
          $scope.ShowSelectedLocation=true;
          $scope.selectedBins.push(location);
          $scope.LocationSearchText = "";
          $scope.ShowSearch = false;
          $scope.ShowNoRecordsFound = false;
     
           
    };
 
   
    
})

