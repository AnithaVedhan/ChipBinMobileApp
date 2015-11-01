startercontrollers
    .controller('CustomDetailCtrl', function($scope,$rootScope,Chats,$http,InstagramApiUrl,$filter) {
 
    ////variable declaration.
 $scope.HideGraph=false;
 $rootScope.InAnalyticsTab=false;
 $scope.currentDate = new Date();
 $scope.fromDate = new Date();
 $scope.toDate = new Date();
 $scope.startDate=  $scope.fromDate;
 $scope.endDate= $scope.toDate;
    
    ////date picker
 $scope.datePickerFromCallback = function (val) {
    if (!val) { 
        alert("From date");
        console.log('Date not selected');
    } else {
        console.log('Selected date is : ', val);
        $scope.startDate=val;
    }
};
 $scope.datePickerToCallback = function (val) {
    if (!val) { 
        alert("TO date");
        console.log('Date not selected');
    } else {
        console.log('Selected date is : ', val);
        $scope.endDate=val;
    }
};
 
    
$scope.ShowStartDate=$filter('date')(  $scope.startDate, 'MMMM/dd/yyyy');
$scope.ShowEndDate=$filter('date')(  $scope.endDate, 'MMMM/dd/yyyy');
$scope.XAxis="";
$scope.selectedBinsIDs=[];
    
$scope.selectedBinsIDs.push( $rootScope.SelectedBinDetails[0].BinID);
$scope.SelectedBin=$rootScope.SelectedBinDetails;
    
var data="";
for(var i=0;i<$scope.selectedBinsIDs.length;i++)
{
data=data+"'"+$scope.selectedBinsIDs[i]+"'"+",";
}
data=data.replace(/,*$/, ""); 
    
$scope.getGraph=function(){
     $rootScope.InBinDetailsTab=false;
  $rootScope.InCustomDetailsTab=true;            
    $scope.startDate= $filter('date')($scope.startDate, 'yyyy-MM-dd');
     $scope.endDate= $filter('date')($scope.endDate, 'yyyy-MM-dd');
         var dt1 = $scope.startDate.split('-'),
            dt2 = $scope.endDate.split('-'),
            one = new Date(dt1[0], dt1[1], dt1[2]),
            two = new Date(dt2[0], dt2[1], dt2[2]);
        
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = two.getTime() - one.getTime();
        var days = (millisBetween / millisecondsPerDay)+1;
         
           if(days>7)
        {
        $scope.XAxis="Week";
        }
        else{
         $scope.XAxis="Days";
        }
        
        $http.get(InstagramApiUrl + "/ChipBin/analytics_details.php?selectedBins="+data+"&startDate="+  $filter('date')($scope.startDate, 'yyyy-MM-dd')+"&endDate="+$filter('date')($scope.endDate, 'yyyy-MM-dd'))
     .success(
                      function(response){  
                          
                           $scope.ShowStartDate=$filter('date')(  $scope.startDate, 'MMMM/dd/yyyy');
                        $scope.ShowEndDate=$filter('date')(  $scope.endDate, 'MMMM/dd/yyyy');
                          
                           console.log('date',$scope.dateEnd)
                          $scope.mydata=[];
                         $rootScope.dataBinCustSet=[];
                          $scope.NoDataList=[];
                        // alert(response);
                          $rootScope.categoriesBinCust=[];
                           $scope.ShowMessage=false;
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
                         
                          for(var i=0;i<$scope.SelectedBin.length;i++)
                           {
                              $scope.humidity=[];
                               $scope.temperature=[];
                                $scope.category=[];
                               $scope.HasData=false;
                               var averagehumidity=0;
                               var averagetemperature=0;
                               var k=0;
                               var weekNumber=0;
                               var totaldays=0;
                               $scope.queryOption=$scope.SelectedBin[i].Name;
                               for( var j =0;j<$scope.mydata.length;j++)
                               {
                                if ($scope.mydata[j].BinID==$scope.SelectedBin[i].BinID)
                                    { if(days<=7)
                                    {
                                        $scope.ShowMessage=false;
                                        $scope.HasData=true;
                                        $scope.humidity.push({value:$scope.mydata[j].humidity});
                                        $scope.temperature.push({value:$scope.mydata[j].temperature});
                                        $scope.category.push({label:$scope.mydata[j].day});
                                    }
                                    
                                       else
                                        {
                                          $scope.ShowMessage=true;
                                           if(k<=7)
                                           {
                                            averagehumidity+=parseInt($scope.mydata[j].humidity);
                                            averagetemperature+= parseInt($scope.mydata[j].temperature);  
                                            k+=1;      
                                            totaldays+=1;
                                       
                                         if(k==7)
                                          {
                                             weekNumber+=1;
                                             $scope.humidity.push({value:(averagehumidity/7)});
                                             $scope.temperature.push({value:(averagetemperature/7)});
                                             $scope.category.push({label:'Week '+weekNumber});
                                                   k=0;
                                                   averagehumidity=0;
                                                   averagetemperature=0;
                                             
                                           }
                                           else if(totaldays==days)
                                             {
                                             weekNumber+=1;
                                             var number=Math.floor(days/7);
                                             var divideBy=days-(number*7);
                                             console.log(divideBy);
                                             $scope.humidity.push({value:(averagehumidity/divideBy)});
                                             $scope.temperature.push({value:(averagetemperature/divideBy)});
                                             $scope.category.push({label:'Week '+weekNumber});
                                             }
                                            
                                            if(totaldays==days)
                                            {
                                             $scope.HasData=true;
                                            }
                                        }
                                        }
                               }
                          
                               }
                                     if($scope.HasData) {
                         
                       $rootScope.categoriesBinCust.push({category:$scope.category})
                     $rootScope.dataBinCustSet.push({"seriesname":'Humidity',"data":$scope.humidity});      $rootScope.dataBinCustSet.push({"seriesname":'Temperature',"parentyaxis": "S","renderAs":"line","showValues":"0",data:$scope.temperature});
                            $scope.HideGraph=true;
                       }
                           else{
                                   
                               $scope.NoDataList.push($scope.SelectedBin[i].Name);
                               }
                                         
                     }
                
                          $rootScope.attrsBinCust.subCaption="From "+ $scope.ShowStartDate+" To "+$scope.ShowEndDate;
         
                     }
              
            
             );
     };

    ////attributes and categories declaration for graph
    $rootScope.attrsBinCust={
        "caption": $scope.SelectedBinDetails[0].Name ,
        "subCaption":"From "+ $scope.ShowStartDate+" To "+$scope.ShowEndDate,
        "xAxisName": $scope.XAxis,   
        "formatnumberscale": "0",
        "palettecolors": "#00CED1,#0000CD,#9DCD3F,#008080,#64D3D1,#9932CC,#FD9927,#FA8072",
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
        "exportAtClientSide":"0",
        "exportEnabled": "1",
        "exportTargetWindow": "_self",
        "exportFileName": "GarboClean",
        "exportHandler":"http://export.api3.fusioncharts.com/logo/",
        "pYAxisName":"Humidity(%)",
        "sYAxisName":"Temperature(degree)", 
        "sNumberSuffix": "°C", 
    };
    $rootScope.categoriesBinCust=[
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
      ],
    $rootScope.dataBinCustSet =[];
   
  
    
    
});