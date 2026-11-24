var test = require('node:test');
var assert = require('node:assert');
var harness = require('./harness');

function word(en) {
	return { en: en, bn: '', pron: ['', ''], bn_syns: [], en_syns: [], sents: [] };
}

function searchScope(words) {
	var Words = harness.wordsService(words);
	var scope = { $on: function () {}, $broadcast: function () {} };
	harness.load('controllers/SearchCtrl.js').SearchCtrl(scope, Words, null, { go: function () {} });
	return scope;
}

function names(words) {
	return words.map(function (w) { return w.en; });
}

test('search ignores case and surrounding whitespace', function () {
	var scope = searchScope([word('carry'), word('carry-on')]);

	scope.search('  Carry ');

	assert.deepStrictEqual(names(scope.suggestions), ['carry', 'carry-on']);
});

test('getByName ignores case and surrounding whitespace', function () {
	var Words = harness.wordsService([word('carry')]);

	assert.strictEqual(Words.getByName(' Carry ').en, 'carry');
});

test('clearing the search leaves nothing to load', function () {
	var words = [];
	for (var i = 0; i < 35; i++) words.push(word('a' + i));
	var scope = searchScope(words);

	scope.search('a');
	scope.search('');

	assert.strictEqual(scope.suggestions.length, 0);
	assert.strictEqual(scope.moreDataCanBeLoaded(), false);
});

test('loadMore pages through every suggestion without skipping any', function () {
	var words = [];
	for (var i = 0; i < 35; i++) words.push(word('a' + (i < 10 ? '0' : '') + i));
	var scope = searchScope(words);

	scope.search('a');
	while (scope.moreDataCanBeLoaded()) scope.loadMore();

	assert.deepStrictEqual(names(scope.suggestions), names(words));
});
