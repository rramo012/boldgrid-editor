module.exports = function( config ) {
	var BOLDGRID = BOLDGRID || {};

	config.set( {
		frameworks: [ 'jasmine', 'es6-shim' ],
		reporters: [ 'spec' ],
		browsers: [ 'PhantomJS' ],
		files: [
			'https://code.jquery.com/jquery-1.12.4.min.js',
			'assets/js/editor.min.js',
			'tests/**/*.js'
		]
	} );
};
