
startercontrollers
.controller('EmailComposerCtrl', function ($scope,$rootScope) {
    $rootScope.AllowDownLoad="1";
    $scope.email=[{
    ToMail:'',
    Subject:'',
    Body:''
    }];
    
  $scope.sendFeedback = function (email) {
    
        if (window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
                console.log("Response -> " + result);
            },
           email.Subject, // Subject
            email.Body,                      // Body
            email.ToMail,    // To
            null,                    // CC
            null,                    // BCC
            true,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
    }
}); 
