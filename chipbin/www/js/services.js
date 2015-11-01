angular.module('starter.services', [])
.service('LoginService', function($q,$http, InstagramApiUrl) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var role;
            
            
            var url = '';
           
            var deferred = $q.defer();
          //  $ionicLoading.show({ template: '<p class="item-icon-left">Fetching data<ion-spinner icon="android"/></p>' });
            $http({
                url:InstagramApiUrl + "/ChipBin/login_details.php?name="+name,                
                method: "GET"
            }).
            success(function (data) {
            //    $ionicLoading.hide();
                deferred.resolve(data);

            }).
            error(function (data) {
           //     $ionicLoading.hide();
                deferred.reject(data);
            })
            return deferred.promise;
            
        
            
      
        }
    }
})
 .factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 'JAYAN1',
    name: 'JAYAN1',
    humidity: [{"value":"11"}, {"value":"99"}, {"value":"65"}, {"value":"12"}, {"value":"14"}, {"value":"98"}, {"value":"97"}],
    fillTrend:  [{"value":"12"}, {"value":"19"}, {"value":"15"}, {"value":"22"}, {"value":"24"}, {"value":"80"}, {"value":"97"}],
      temperature: [{"value":"15"}, {"value":"13"}, {"value":"14"}, {"value":"14"}, {"value":"12"}, {"value":"81"}, {"value":"72"}],
    selected:false
  }, {
    id: 'JAYAN2',
     name: 'JAYAN2',
    humidity: [{"value":"61"}, {"value":"69"}, {"value":"45"}, {"value":"12"}, {"value":"14"}, {"value":"8"}, {"value":"7"}],
    fillTrend:  [{"value":"19"}, {"value":"95"}, {"value":"57"}, {"value":"90"}, {"value":"90"}, {"value":"89"}, {"value":"97"}],
    temperature:[{"value":"131"}, {"value":"39"}, {"value":"54"}, {"value":"19"}, {"value":"14"}, {"value":"8"}, {"value":"7"}],
    selected:false
  }, {
    id: 'JAYAN3',
     name:'JAYAN3',
     humidity:  [{"value":"41"}, {"value":"79"}, {"value":"75"}, {"value":"12"}, {"value":"84"}, {"value":"98"}, {"value":"97"}],
     fillTrend:[{"value":"11"}, {"value":"89"}, {"value":"59"}, {"value":"92"}, {"value":"14"}, {"value":"08"}, {"value":"7"}],
      temperature: [{"value":"16"}, {"value":"79"}, {"value":"75"}, {"value":"92"}, {"value":"14"}, {"value":"98"}, {"value":"07"}],
      selected:false
    
  }, {
    id: 'DOMAL1',
     name: 'DOMAL1',
    humidity:[{"value":"11"}, {"value":"49"}, {"value":"45"}, {"value":"12"}, {"value":"14"}, {"value":"78"}, {"value":"87"}],
    fillTrend:[{"value":"14"}, {"value":"96"}, {"value":"23"}, {"value":"18"}, {"value":"14"}, {"value":"8"}, {"value":"7"}],
      temperature:[{"value":"11"}, {"value":"9"}, {"value":"75"}, {"value":"72"}, {"value":"14"}, {"value":"89"}, {"value":"7"}],
    selected:false
  
  }, {
    id: 'DOMAL2',
     name:'DOMAL2',
    humidity: [{"value":"11"}, {"value":"89"}, {"value":"95"}, {"value":"12"}, {"value":"14"}, {"value":"38"}, {"value":"97"}],
    fillTrend: [{"value":"11"}, {"value":"9"}, {"value":"35"}, {"value":"32"}, {"value":"14"}, {"value":"8"}, {"value":"7"}],
    temperature:[{"value":"11"}, {"value":"93"}, {"value":"5"}, {"value":"32"}, {"value":"14"}, {"value":"38"}, {"value":"73"}],
    selected:false
  }];
    
    var filterOption=[{
    option:'Humidity'
    },{
    option:'Fill Trend'
    },{
    option:'Empty Trend'
    }]

    
    
  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    allOption: function(){
    return filterOption;
    }
      
  };
});

        