'use strict';
define(['lodash'], function (_) {
  var dependencies = ['$scope', '$state', '$modal', 'PageTitleService'];

  var ChooseProblemController = function (
    $scope,
    $state,
    $modal,
    PageTitleService
  ) {
    // functions
    $scope.openChooseProblemModal = openChooseProblemModal;

    // init
    $scope.model = {};
    $scope.local = {};

    $scope.$watch('local.contents', function (newVal) {
      if (!_.isEmpty(newVal)) {
        $scope.model.choice = 'local';
      }
    });

    PageTitleService.setPageTitle('ChooseProblemController', 'Workspaces');

    function openChooseProblemModal() {
      $modal.open({
        templateUrl: './createWorkspace.html',
        controller: 'CreateWorkspaceController',
        resolve: {
          callback: function () {
            return function (workspaceType, workspaceOrManualInputId) {
              if (workspaceType === 'manual') {
                $state.go('manualInput', {
                  inProgressId: workspaceOrManualInputId
                });
              } else {
                $state.go('evidence', {
                  workspaceId: workspaceOrManualInputId.id,
                  problemId: workspaceOrManualInputId.defaultSubProblemId,
                  id: workspaceOrManualInputId.defaultScenarioId
                });
              }
            };
          }
        }
      });
    }
  };
  return dependencies.concat(ChooseProblemController);
});
