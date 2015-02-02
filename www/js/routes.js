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