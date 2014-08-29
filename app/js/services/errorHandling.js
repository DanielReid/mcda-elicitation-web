'use strict';
define(['angular'], function() {
  var dependencies = [];
  var ErrorHandling = function($q, $rootScope) {
    return {
      'responseError': function(rejection) {
        var data = rejection.data;
        var message = {
          code: data.code,
          cause: data.message
        };
        $rootScope.$broadcast('error', message);
        return $q.reject(rejection);
      }
    };
  };

  return dependencies.concat(ErrorHandling);
});
