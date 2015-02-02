angular.module('ortho')
.controller('QuizLevelsCtrl', ["$scope",
    function($scope) {
    	$scope.levels = _.range(1, 40);

}]);