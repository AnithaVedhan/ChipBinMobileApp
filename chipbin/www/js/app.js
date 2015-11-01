// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ionic-datepicker'])
.constant('InstagramApiUrl', 'http://samyam.co.in')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
.state('login', {
      url: '/login',
      templateUrl: 'templates/tab-login.html',
      controller: 'loginCtrl'
  })
 
  // setup an abstract state for the tabs directive
    .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'menu.html',
     
  })
  
  .state('main.tabs', {
    url: '/tab',
    abstract: true,
    views: {
      'menu-content': {
        templateUrl: 'templates/tabs.html',
        
      }
    }
  })

 
  // Each tab has its own nav history stack:

  .state('main.tabs.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('main.tabs.analytics', {
      url: '/analytics',
      views: {
        'tab-analytics': {
          templateUrl: 'templates/tab-analytics.html',
          controller: 'analyticsCtrl'
        }
      }
    })
    .state('main.tabs.analytics-detail', {
      url: '/analytics-deatils/',
       cache: false,
      views: {
        'tab-analytics': {
          templateUrl: 'templates/analytics-detail.html',
          controller: 'analyticsDetailCtrl'
        }
      },
  params: {
 selectedBinsID: null,
      selectedBin:null,
      queryHeader:null,
      startDate:null,
      endDate:null 
  }
    })
  .state('main.tabs.binDeatils', {
    url: '/binDetails',
    cache: false,
    views: {        
      'tab-binDetails': {
        templateUrl: 'templates/tab-account.html',
        controller: 'BinDetailsCtrl'
      }
    } ,  params: {
 selectedBinsID: null}
  })
   .state('main.tabs.custom-detail', {
      url: '/custom-detail/',
      views: {
        'tab-binDetails': {
          templateUrl: 'templates/custom-detail.html',
          controller: 'CustomDetailCtrl'
        }
      }
    })
   .state('main.tabs.export-Analytics', {
    url: '/export',
    views: {
      'tab-analytics': {
        templateUrl: 'templates/export.html',
        controller: 'EmailComposerCtrl'
      }
    }
  })
   .state('main.tabs.export-BinDetails', {
    url: '/export',
    views: {
      'tab-binDetails': {
        templateUrl: 'templates/export.html',
        controller: 'EmailComposerCtrl'
      }
    }
  })
   .state('main.tabs.export-dash', {
    url: '/export',
    views: {
      'tab-analytics': {
        templateUrl: 'templates/export.html',
        controller: 'EmailComposerCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/login');

}) 
