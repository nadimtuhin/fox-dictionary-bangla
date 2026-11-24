// Loads an app source file in a sandbox with a fake angular.module so the
// registered factories and controllers can be called directly from tests.
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var _ = require('lodash');

function load(file) {
	var registered = {};
	var moduleApi = {
		factory: function (name, def) { registered[name] = def[def.length - 1]; return moduleApi; },
		controller: function (name, def) { registered[name] = def[def.length - 1]; return moduleApi; }
	};
	var sandbox = {
		_: _,
		console: { log: function () {} },
		angular: { module: function () { return moduleApi; } }
	};
	var source = fs.readFileSync(path.join(__dirname, '..', 'www', 'js', file), 'utf8');
	vm.runInNewContext(source, sandbox, { filename: file });
	return registered;
}

function wordsService(words) {
	var factory = load('services/Words.js').Words;
	return factory({ get: function () { return { then: function (cb) { cb({ data: words }); } }; } });
}

module.exports = { load: load, wordsService: wordsService };
