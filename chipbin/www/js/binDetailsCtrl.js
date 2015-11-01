startercontrollers
.controller('BinDetailsCtrl', function($scope,Chats,$state,$rootScope,$http,InstagramApiUrl,$filter,$stateParams ) {
   
 ////variable declaration
 $rootScope.InAnalyticsTab=false;
 $rootScope.InBinDetailsTab=true;
 $rootScope.InCustomDetailsTab=false; 
 $rootScope.binDataset=[];
 $scope.selectedBinsIDs=[];
 $scope.selectedBinsIDs.push($stateParams.selectedBinsID[0].BinID);
 $scope.startDate=new Date();
 $scope.endDate=new Date();
 $scope.startDate.setDate($scope.startDate.getDate()-6);
 $rootScope.SelectedBinDetails=[];
 $scope.ShowCustom=false;
 $scope.ShowWeek=true;
 $scope.ShowStartDate=$filter('date')(  $scope.startDate, 'MMMM/dd/yyyy');
 $scope.ShowEndDate=$filter('date')(  $scope.endDate, 'MMMM/dd/yyyy');
 $rootScope.SelectedBinDetails=$stateParams.selectedBinsID;
    
    
var data="";
        for(var i=0;i<$scope.selectedBinsIDs.length;i++)
        {
        data=data+"'"+$scope.selectedBinsIDs[i]+"'"+",";
        }
        data=data.replace(/,*$/, ""); 
     
    ////call to get the bin deatils.
   $http.get(InstagramApiUrl+"/ChipBin/analytics_details.php?selectedBins="+data+"&startDate="+  $filter('date')($scope.startDate, 'yyyy-MM-dd')+"&endDate="+$filter('date')($scope.endDate, 'yyyy-MM-dd'))
     .success(
                      function(response){  
                          $scope.mydata=[];
                          $rootScope.binDataset=[];
                        // alert(response);
                          $rootScope.binCategories=[];
                         for(var i = 0; i < response.length; i++)
                         { array = [];
                          
                         array = response[i].split(',');
                      
                         a = array[0]; b = array[1]; c = array[2]; d = array[3]; e = array[4]; f=array[5];                          
                         $scope.mydata.push({ 
                                        BinID : a,
                                        humidity : b,
                                        fillTrend : c,
                                        temperature:d,
                                        transactionDate:e,
                                        day:f
                                       } );  
                         
                         };
                         
                          for(var i=0;i<$scope.selectedBinsIDs.length;i++)
                           {
                              $scope.humidity=[];
                               $scope.temperature=[];
                                $scope.category=[];
                               for( var j =0;j<$scope.mydata.length;j++)
                               {
                                if ($scope.mydata[j].BinID==$scope.selectedBinsIDs[i])
                                    {   $scope.hasData=true;
                                        $scope.humidity.push({value:$scope.mydata[j].humidity});
                                        $scope.temperature.push({value:$scope.mydata[j].temperature});
                                        $scope.category.push({label:$scope.mydata[j].day});
                                        
                                    }
                               }
                                               
                     }
                       $rootScope.binCategories.push({category:$scope.category})
                       $rootScope.binDataset.push({"seriesname":'Humidity',"data":$scope.humidity});      $rootScope.binDataset.push({"seriesname":'Temperature',"parentyAxis": "S","renderAs":"line","showValues":"0",data:$scope.temperature});
                           $rootScope.binAttrs.subCaption="From "+ $scope.ShowStartDate+" To "+$scope.ShowEndDate;
                     }
             );
    
    
    ////attribute and categories for the graphs
    $rootScope.binAttrs={
        "caption": $scope.SelectedBinDetails[0].Name ,
        "xAxisName": "Day",   
        "formatnumberscale": "0",
        "palettecolors": "#FD9927,#FECE2F,#9DCD3F,#CECD42,#64D3D1",
        "canvaspadding": "1",
        "bgcolor": "FFFFFF",
        "showalternatehgridcolor": "0",
        "showplotborder": "0",
        "divlinecolor": "CCCCCC",
        "interactivelegend": "0",
        "showvalues": "0",
        "showcanvasborder": "0",
        "showpercentvalues": "1",
        "showsum": "1",
        "numberprefix": "%",
        "canvasborderalpha": "0",
        "legendshadow": "0",
        "legendborderalpha": "0",
        "showborder": "0",
      "plotgradientcolor":"",
"showalternatehgridcolor":"0",
"slantlabels":"1",
          "exportAtClientSide":"0",
        "exportEnabled": "1",
          "exportTargetWindow": "_self",
        "exportFileName": "GarboClean",
        "exportHandler":"http://export.api3.fusioncharts.com/logo/",
                 "pYAxisName":"Humidity(%)",
"sYAxisName":"Temperature(degree)", 
 "sNumberSuffix": "°C", 
  
    } 
    $rootScope.binCategories=[
         {
            "category": [
                {
                    "label": "Mon"
                },
                {
                    "label": "Tue"
                },
                {
                    "label": "Wed"
                },
                {
                    "label": "Thu"
                },
                {
                    "label": "Fri"
                },
                {
                    "label": "Sat"
                },
                {
                    "label": "Sun"
                }
              ]
    
          } 
      ]
  
    
////Calls when custom button is clicked
 $scope.custom=function(){
      
   $scope.ShowCustom=true;
   $scope.ShowWeek=false;
          $rootScope.InCustomDetailsTab=true;
           $rootScope.InBinDetailsTab=false;
        
    };
    
////Calls when week button is clicked    
 $scope.week=function(){
      
   $scope.ShowCustom=false;
   $scope.ShowWeek=true;
           $rootScope.InCustomDetailsTab=false;
           $rootScope.InBinDetailsTab=true;
    }; 

        

    
})

