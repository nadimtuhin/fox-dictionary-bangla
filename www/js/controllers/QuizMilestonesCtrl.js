angular.module('ortho')
.controller('QuizMilestonesCtrl', ["$scope", "$stateParams",
    function($scope, $stateParams) {
    	$scope.milestones = _.range(1, 11);
    	$scope.levelId = $stateParams.id;

}]);