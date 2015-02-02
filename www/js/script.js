function gs(name) {
  return angular.element(document.body).injector().get(name);
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ortho' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ortho.services' is found in services.js
// 'ortho.controllers' is found in controllers.js
angular.module('ortho', ['ionic', 'ngMaterial'])
.directive('keyboardHandler', function ($window) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            angular.element($window).bind('native.keyboardshow', function() {
                element.addClass('tabs-item-hide');
            });

            angular.element($window).bind('native.keyboardhide', function() {
                element.removeClass('tabs-item-hide');
            });
        }
    };
})
.run(["$ionicPlatform", function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}]);
angular.module('ortho')
.factory('Words', ["$http", function($http){
	var words;

	$http.get("js/data/db.json").then(function(res){
		words = res['data'];
	});

	return {
		all: function(){
			return words;
		},
		getByName: function(word){
			return _.findWhere(words, {en: word})
		}
	};
}]);
angular.module('ortho')
.controller('AboutCtrl', ["$scope",
    function($scope) {

}]);
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
angular.module('ortho')
.controller('QuizLevelsCtrl', ["$scope",
    function($scope) {
    	$scope.levels = _.range(1, 40);

}]);
angular.module('ortho')
.controller('QuizMilestonesCtrl', ["$scope", "$stateParams",
    function($scope, $stateParams) {
    	$scope.milestones = _.range(1, 11);
    	$scope.levelId = $stateParams.id;

}]);
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
angular.module('ortho')
.controller('WordMeaningCtrl', ["$scope", "$stateParams", "Words", "$timeout", "$ionicNavBarDelegate",
    function($scope, $stateParams, Words, $timeout, $ionicNavBarDelegate) {
		$timeout( function() {
			$ionicNavBarDelegate.showBackButton(false);
		}, 0);

        // $timeout(function(){
            $scope.word = Words.getByName($stateParams.wordId);
            $scope.word.bn_syns = $scope.word.bn_syns.join(", ");
            $scope.word.en_syns = $scope.word.en_syns.join(", ");
        // }, 900);
}]);
angular.module('ortho')
.config(["$stateProvider", "$urlRouterProvider", "$compileProvider",
	function($stateProvider, $urlRouterProvider, $compileProvider) {

		//fixes issues with ffos
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/search');

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		$stateProvider
		// setup an abstract state for the tabs directive
		.state('app', {
			url: "/app",
			abstract: true,
			templateUrl: "templates/menu.html",
			controller: ["Words", function(Words){
				//bootstrap
			}]
		})




		// Each app has its own nav history stack:
		.state('app.search', {
			url: '/search',
			views: {
				'menuContent': {
					templateUrl: 'templates/search/search.html',
					controller: 'SearchCtrl'
				}
			}
		})
		.state('app.search-meaning', {
			url: '/search/meaning/:wordId',
			views: {
				'menuContent': {
					templateUrl: 'templates/search/meaning.html',
					controller: 'WordMeaningCtrl'
				}
			}
		})
		.state('app.quiz-levels', {
			url: '/quiz-levels',
			views: {
				'menuContent': {
					templateUrl: 'templates/quiz/levels.html',
					controller: 'QuizLevelsCtrl'
				}
			}
		})
		.state('app.quiz-milestones', {
			url: '/quiz-milestones/:id',
			views: {
				'menuContent': {
					templateUrl: 'templates/quiz/milestones.html',
					controller: 'QuizMilestonesCtrl'
				}
			}
		})
		.state('app.quiz', {
			url: '/quiz/:levelId/:milestoneId',
			views: {
				'menuContent': {
					templateUrl: 'templates/quiz/quiz.html',
					controller: 'QuizCtrl'
				}
			}
		})
		.state('app.about', {
			url: '/about',
			views: {
				'menuContent': {
					templateUrl: 'templates/about.html',
				}
			}
		});


}]);