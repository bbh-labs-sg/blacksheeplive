var path = require('path');

module.exports = {
	entry: '.' + path.sep + 'js' + path.sep + 'components' + path.sep + 'build' + path.sep + 'App.js',
	output: {
		filename: '.' + path.sep + 'js' + path.sep + 'bundle.js',
	},
	resolve: {
		moduleDirectories: [ 'node_modules' ],
	},
}
