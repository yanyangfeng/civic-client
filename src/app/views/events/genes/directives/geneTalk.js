(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk)
    .controller('GeneTalkController', GeneTalkController);

  // @ngInject
  function geneTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalk.tpl.html',
      controller: 'GeneTalkController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneTalkController ($scope, $stateParams, GenesSuggestedChanges, $log) {

    GenesSuggestedChanges.query({'geneId': $stateParams.geneId })
      .$promise.then(function(response) {
        var suggestedChanges = [];
        var statusOrder = ['active', 'new', 'applied', 'closed'];
        var statusGroups = _.groupBy(response, 'status');
        _.each(statusOrder, function(stat) {
          if (_.has(statusGroups, stat)) {
            _.each(_.sortBy(statusGroups[stat], 'created_at'), function(change) {
              suggestedChanges.push(change);
            });
          }
        });
        $scope.suggestedChanges = suggestedChanges;
    });
  }
})();