angular.module('ortho')
.controller('SearchCtrl', ["$scope", "Words", "$timeout", "$state",
	function($scope, Words, $timeout, $state) {
    	$scope.suggestions = [];
        $scope.wordsPerPage = 10;
        $scope.allSuggestions = [];
        $scope.medium = {
            s: ""
        }

        $scope.go = function(word){
            $scope.word = Words.getByName(word);
            if (!$scope.word) return;

            // $scope.reset();
            $state.go('app.search-meaning', {wordId: $scope.word.en});
        };

        $scope.search = function(search){
            //TODO: this is a hack remove this
            $scope.medium.s = search;

            if(!search){
                $scope.suggestions = [];
                return;
            }
            $scope.searchPage = 0;

            $scope.allSuggestions = getSuggestions(search);
			$scope.suggestions = $scope.allSuggestions.splice($scope.searchPage, $scope.wordsPerPage); 
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

        $scope.reset = function(){
            $scope.medium.s = '';  //TODO: this is not working
            $scope.suggestions = [];
            $scope.allSuggestions = [];

            console.log('reset complete');
        }

    	$scope.loadMore = function() {
            $scope.searchPage +=  $scope.wordsPerPage;
            
            var suggestions = $scope.allSuggestions.splice($scope.searchPage, $scope.wordsPerPage); 
            $scope.suggestions = $scope.suggestions.concat(suggestions);
			
            $scope.$broadcast('scroll.infiniteScrollComplete');
    	};

        $scope.moreDataCanBeLoaded = function(){
            var canMoreDataBeloaded = $scope.allSuggestions.length > $scope.searchPage;

            console.log('can more data be loaded? ' + canMoreDataBeloaded);
            return canMoreDataBeloaded;
        }

    	$scope.$on('$stateChangeSuccess', function() {
    		$scope.loadMore();
    	});
}]);
