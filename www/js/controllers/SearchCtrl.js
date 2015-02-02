angular.module('ortho')
.controller('SearchCtrl', ["$scope", "Words", "$timeout", "$state",
    function($scope, Words, $timeout, $state) {
	$scope.suggestions = [];

	$scope.go = function(word){
        $scope.word = Words.getByName(word);
        if (!$scope.word)return;

        $state.go('app.search-meaning', {wordId: $scope.word.id});
	};
    
    $scope.search = function(search){
    	if(!search){
			$scope.suggestions = [];
			return;
    	}
        $scope.suggestions = getSuggestions(search).splice(0,20); //take 20
    };

    var getWordMatches = function(search){
    	return _.filter(Words.all(), function(word){
		   return -1 !== word.en.indexOf(search);
		});
    };

    var getSuggestions = function(search){
    	var suggestions = getWordMatches(search);

    	var startMatches = _.filter(suggestions, function(word){
    		return 0 === word.en.indexOf(search);
    	});

    	var middleMatches = _.filter(suggestions, function(word){
    		return 0 !== word.en.indexOf(search);
    	});

    	return startMatches.concat(middleMatches);
    };
}]);