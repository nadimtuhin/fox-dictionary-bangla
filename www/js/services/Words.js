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