angular.module('ortho')
.controller('WordMeaningCtrl', ["$scope", "$stateParams", "Words", "$timeout", "$ionicNavBarDelegate",
    function($scope, $stateParams, Words, $timeout, $ionicNavBarDelegate) {
		$timeout( function() {
			$ionicNavBarDelegate.showBackButton(false);
		}, 0);

        // $timeout(function(){
            $scope.word = Words.getByName($stateParams.wordId);
            $scope.bnSyns = $scope.word.bn_syns.join(", ");
            $scope.enSyns = $scope.word.en_syns.join(", ");
        // }, 900);
}]);