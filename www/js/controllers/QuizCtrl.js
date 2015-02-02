angular.module('ortho')
.controller('QuizCtrl', ["$scope", "$stateParams",
    function($scope, $stateParams) {
    	console.log($stateParams);
    	$scope.levelId = $stateParams.levelId;
    	$scope.milestoneId = $stateParams.milestoneId;
    	$scope.words = [];

    	$scope.id = ($scope.levelId-1)*100 + ($scope.milestoneId-1)*10 + 1;
    	
    	var generateOptions = function(id){
	    	$scope.word = gs('Words').get(id);
	    	var words = _.sample(gs('Words').all(), 3);

	    	words.push($scope.word);

	    	return _.shuffle(words);
    	};

    	$scope.words = generateOptions($scope.id++);

    	$scope.answer = function(word){
	    	$scope.words = generateOptions($scope.id++);
    	};
}]);