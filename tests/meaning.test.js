var test = require('node:test');
var assert = require('node:assert');
var harness = require('./harness');

function openMeaning(Words, en) {
	var scope = {};
	harness.load('controllers/WordMeaningCtrl.js').WordMeaningCtrl(
		scope, { wordId: en }, Words, function () {}, { showBackButton: function () {} }
	);
	return scope;
}

test('a word can be opened more than once', function () {
	var Words = harness.wordsService([
		{ en: 'carry', bn: 'বহন', pron: ['', ''], bn_syns: ['বহন করা', 'টানা'], en_syns: ['bear'], sents: [] }
	]);

	openMeaning(Words, 'carry');
	var scope = openMeaning(Words, 'carry');

	assert.strictEqual(scope.bnSyns, 'বহন করা, টানা');
	assert.strictEqual(scope.enSyns, 'bear');
});
