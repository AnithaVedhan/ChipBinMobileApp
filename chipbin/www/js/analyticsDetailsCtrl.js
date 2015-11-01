startercontrollers
.controller('analyticsDetailCtrl', function($scope, $stateParams, Chats,$state,$rootScope,$http,InstagramApiUrl,$filter) {
    
    $scope.selectedBins=[];
    $scope.queryOption='';
    
    ////If statteparams are undefined go back to analytics tab
    if($stateParams.selectedBinsID === null|| $stateParams.selectedBinsID === 'undefiend')
    {
         $state.go('main.tabs.analytics')
    }
    else
    {
     
  ////variabl declaration
  $rootScope.dataset=[];
  $scope.selectedBinsIDs=[];
  $scope.selectedBinsIDs=$stateParams.selectedBinsID;
  $scope.selectedBins=$stateParams.selectedBin;
  $scope.startDate= $stateParams.startDate;
  $scope.endDate= $stateParams.endDate;  

  $rootScope.InAnalyticsTab=true;
  $rootScope.InBinDetailsTab=false;
  $rootScope.InCustomDetailsTab=false;     

  $scope.ShowStartDate=$filter('date')(  $scope.startDate, 'MMMM/dd/yyyy');
  $scope.ShowEndDate=$filter('date')(  $scope.endDate, 'MMMM/dd/yyyy');
       
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
        
         
var data="";
     
   for(var i=0;i<$scope.selectedBinsIDs.length;i++)
   {
   data=data+"'"+$scope.selectedBinsIDs[i]+"'"+",";
   }
        
        data=data.replace(/,*$/, ""); 
        
        $scope.NoDataFlag=false;
        $scope.queryOption=$stateParams.queryHeader;
        $rootScope.ShowEmpty=false;
        $rootScope.ShowOther=true;
        $rootScope.emptyDataset=[];
        $rootScope.emptyCategories=[];
        $scope.NoDataList=[];
        
        ////When user selects empty trend option 
        if( $scope.queryOption==="Empty Trend")
        {
           
             $rootScope.ShowEmpty=true;
        $rootScope.ShowOther=false;
             $http.get(InstagramApiUrl + "/ChipBin/emptyTrend_details.php?   selectedBins="+data+"&startDate="+$scope.startDate+"&endDate="+$scope.endDate)
             .success(
             function(response)
                 {
                     if(response.length>0)
                     {
             $rootScope.emptyCategories=[];
                     $scope.emptyCategory=[];
                      $scope.mydata=[];
                         var temp=[];
                   for(var i = 0; i < response.length; i++)
                         { array = [];
                          
                         array = response[i].split(',');
                      
                         a = array[0]; b = array[1]; c = array[2];                          
                         $scope.mydata.push({ 
                                        BinID : a,
                                        fillTrend : b,
                                        emptyDate:c
                                       } );
                          temp.push(c);
                                                 
                         };
                         
$scope.unique2 = function(array)
{
	var n = {},r=[];
	for(var i = 0; i < array.length; i++) 
	{
		if (!n[array[i]]) 
		{
			n[array[i]] = true; 
			r.push({label:array[i]}); 
		}
	}
	return r;
}

                     
                  $scope.emptyCategory= $scope.unique2(temp)
                  
                         console.log(temp);
                   for(var i=0;i<$scope.selectedBins.length;i++)
                   {
                       $scope.data=[];
                        
                         $scope.add=false;
                     for (var k=0;k<$scope.emptyCategory.length;k++)
                     {
                         $scope.Datafound=false;
                      for (var j=0;j<$scope.mydata.length;j++)
                      {
                         if($scope.mydata[j].BinID === $scope.selectedBins[i].BinID && $scope.mydata[j].emptyDate===$scope.emptyCategory[k].label  )
                         {
                            $scope.Datafound=true;
                             $scope.add=true;
                           $scope.data.push({value:$scope.mydata[j].fillTrend});
                         
                         }
                          else if(j==($scope.mydata.length-1) && $scope.Datafound==false)
                          {
                            $scope.data.push({value:""})
                          }
                          
                      }
                   
                   }
                       
                       if(!$scope.add)
                       {
                           $scope.NoDataList.push($scope.selectedBins[i].Name);
                       }
                       else{
                       $rootScope.emptyDataset.push({seriesname:$scope.selectedBins[i].BinID,data:$scope.data});
                           }
                   }
                         
                          $rootScope.emptyCategories.push({category: $scope.emptyCategory});
                     }
                     else{
                     $scope.NoDataFlag=true;
                     }
                 
                 })
        }
    ////when user selects filltrend or humidity             
else{
        
       $http.get( InstagramApiUrl+"/ChipBin/analytics_details.php?selectedBins="+data+"&startDate="+$scope.startDate+"&endDate="+$scope.endDate)
     .success(
                      function(response){  
                          $scope.mydata=[];
                          $scope.NoDataList=[];
                          $scope.ShowListOFNoDataBin=false;
                        // alert(response);
                          $rootScope.categories=[];
                          $scope.ShowMessage=false;
                         for(var i = 0; i < response.length; i++)
                         { array = [];
                          
                         array = response[i].split(',');
                      
                         a = array[0]; b = array[1]; c = array[2]; d = array[3]; e = array[4]; f=array[5];                          
                         $scope.mydata.push({ 
                                        BinID : a,
                                        humidity : b,
                                        fillTrend : c,
                                        temperatue:d,
                                        transactionDate:e,
                                        day:f
                                       } );  
                         
                         };
                         
                          for(var i=0;i<$scope.selectedBins.length;i++)
                           {
                              $scope.humidity=[];
                               $scope.fillTrend=[];
                                $scope.category=[];
                               $scope.HasData=false;
                               var averagehumidity=0;
                               var averagefillTrend=0;
                               var k=0;
                               var weekNumber=0;
                               var totaldays=0;
                               for( var j =0;j<$scope.mydata.length;j++)
                               {
                                if ($scope.mydata[j].BinID==$scope.selectedBins[i].BinID)
                                    {
                                        if(days<=7){
                                        $scope.ShowMessage=false;
                                        $scope.HasData=true;
                                        $scope.humidity.push({value:parseInt($scope.mydata[j].humidity)});
                                        $scope.fillTrend.push({value:parseInt($scope.mydata[j].fillTrend)});
                                         $scope.category.push({label:$scope.mydata[j].day});
                                        }
                                        else
                                        {
                                            $scope.ShowMessage=true;
                                           if(k<=7)
                                           {
                                            averagehumidity+=parseInt($scope.mydata[j].humidity);
                                            averagefillTrend+= parseInt($scope.mydata[j].fillTrend);  
                                            k+=1;      
                                            totaldays+=1;
                                       
                                         if(k==7)
                                          {
                                             weekNumber+=1;
                                             $scope.humidity.push({value:(averagehumidity/7)});
                                             $scope.fillTrend.push({value:(averagefillTrend/7)});
                                             $scope.category.push({label:'Week '+weekNumber});
                                                   k=0;
                                                   averagehumidity=0;
                                                   averagefillTrend=0;
                                             
                                           }
                                           else if(totaldays==days)
                                             {
                                             weekNumber+=1;
                                             var number=Math.floor(days/7);
                                             var divideBy=days-(number*7);
                                             console.log(divideBy);
                                             $scope.humidity.push({value:(averagehumidity/divideBy)});
                                             $scope.fillTrend.push({value:(averagefillTrend/divideBy)});
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
                               
                               if($scope.HasData){
                                if($scope.queryOption==='Fill Trend')
                               {
                                     $rootScope.categories.push({category:$scope.category})
                                   $rootScope.dataset.push({seriesname:$scope.selectedBins[i].Name,data: $scope.fillTrend})
                                  
                               }
                               else if ($scope.queryOption==='Humidity')
                               {
                                    $rootScope.categories.push({category:$scope.category})
                                $rootScope.dataset.push({seriesname:$scope.selectedBins[i].Name,data:$scope.humidity});
                              
                               }
                               }
                               else{
                               $scope.NoDataList.push($scope.selectedBins[i].Name);
                               }
                               
                         
                     }
                     }
  );
     
        }
 
        
    ////attrbuits and category defination for empty trend chart    
    $rootScope.emptyAttrs={
    
        "caption":$scope.queryOption ,
        "subCaption":"From "+ $scope.ShowStartDate+" To "+$scope.ShowEndDate,
        "xAxisName": "Dates",
        "yAxisName": $scope.queryOption+'(%)',
        "numberprefix": "%",
        "plotgradientcolor": "",
        "bgcolor": "FFFFFF",
        "showalternatehgridcolor": "0",
        "divlinecolor": "CCCCCC",
        "showvalues": "0",
        "showcanvasborder": "0",
        "canvasborderalpha": "0",
        "canvasbordercolor": "CCCCCC",
        "canvasborderthickness": "1",
        "captionpadding": "30",
        "yaxisvaluespadding": "15",
        "legendshadow": "0",
        "legendborderalpha": "0",
        "palettecolors": "#f8bd19,#008ee4,,#e44a00,#33bdda,#6baa01,#583e78",
        "showplotborder": "0",
        "showborder": "0",
         "exportAtClientSide":"0",
        "exportEnabled": "1",
          "exportTargetWindow": "_self",
        "exportFileName": "GarboClean",
        "exportHandler":"http://export.api3.fusioncharts.com/logo/",
        "showvalues": "1"
    
    }
    $rootScope.emptyCategories=[{
        
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
        }]
  
    
    ////attrbuits and category defination for fill trend/humidity chart   
    $rootScope.attrs=
    {
        "caption": $scope.queryOption,
        "subCaption":"From "+ $scope.ShowStartDate+" To "+$scope.ShowEndDate,
        "xAxisName": $scope.XAxis,
        "yAxisName": $scope.queryOption+'(%)',
        "numberPrefix": "%",
        "showvalues": "0",
        "plotgradientcolor": "",
        "formatnumberscale": "0",
        "showplotborder": "0",
        "palettecolors": "#00CED1,#9DCD3F,#64D3D1,#FD9927,#FA8072,#f8bd19",
        "canvaspadding": "1",
        "bgcolor": "FFFFFF",
        "showalternatehgridcolor": "0",
        "divlinecolor": "CCCCCC",
        "showcanvasborder": "0",
        "legendborderalpha": "0",
        "legendshadow": "0",
        "interactivelegend": "1",
        "showpercentvalues": "1",
        "showsum": "1",
        "canvasborderalpha": "0",
        "showborder": "0",
           "exportAtClientSide":"0",
        "exportEnabled": "1",
          "exportTargetWindow": "_self",
        "exportFileName": "GarboClean",
        "exportHandler":"http://export.api3.fusioncharts.com/logo/",
        "showalternatehgridcolor": "0",
        "decimals":"2"
    };
    
    $rootScope.categories=[{
        
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
        }]
    }

  
})

