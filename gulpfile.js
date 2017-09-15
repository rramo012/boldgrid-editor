/**
 * Automatically Copies Deps from Framework:
 * FontAwesome
 * jquery-stellar
 * components.css
 * bootstrap.min.css
 * font-family-controls.min.css
 */

var gulp = require( 'gulp' ),
	uglify = require( 'gulp-uglify' ),
	cssnano = require( 'gulp-cssnano' ),
	rename = require( 'gulp-rename' ),
	sass = require( 'gulp-sass' ),
	debug = require( 'gulp-debug' ),
	uglify = require( 'gulp-uglify' ),
	notify = require( 'gulp-notify' ),
	concat = require( 'gulp-concat' ),
	inject = require( 'gulp-inject-string' ),
	sequence = require( 'run-sequence' ),
	jasmine = require( 'gulp-jasmine' ),
	fs = require( 'fs' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	server = require( 'karma' ).Server,
	gutil = require( 'gutil' ),
	readme = require( 'gulp-readme-to-markdown' ),
	pump = require( 'pump' );

// Configs.
var config = {
	src: './',
	dist: './',
	fontDest: './assets/fonts',
	cssDest: './assets/css',
	jsDest: './assets/js',
	jsonDir: './assets/json'
};

gulp.task( 'js-unit-tests', function( done ) {
	return new server(
		{
			configFile: __dirname + '/karma.conf.js',
			singleRun: true
		},
		done
	).start();
} );

gulp.task( 'boldgrid-components', function() {
	gulp
		.src( [ config.src + '/node_modules/boldgrid-component-library/dist/css/components.*' ] )
		.pipe( debug( { title: 'BoldGrid Components:' } ) )
		.pipe( gulp.dest( config.cssDest ) );

	gulp
		.src( [ config.src + '/node_modules/boldgrid-component-library/json/components.json' ] )
		.pipe( debug( { title: 'BoldGrid Components Json:' } ) )
		.pipe( gulp.dest( config.jsonDir ) );
} );

// Compile sass files.
gulp.task( 'sass', function() {
	gulp
		.src( [ config.dist + '/assets/scss/**/*.scss' ] )
		.pipe(
			sass( {
				includePaths: [ config.dist + 'assets/scss/' ]
			} ).on( 'error', sass.logError )
		)
		.pipe( sass.sync().on( 'error', sass.logError ) )
		.pipe( gulp.dest( config.dist + '/assets/css' ) )
		.pipe(
			cssnano( {
				discardComments: { removeAll: true },
				zindex: false
			} )
		)
		.pipe(
			autoprefixer( {
				browsers: [ 'last 2 versions' ],
				cascade: false
			} )
		)
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( gulp.dest( config.dist + '/assets/css' ) );
} );

gulp.task( 'merge-webpack', function() {
	gulp
		.src( [ config.dist + '/assets/css/editor.min.css', config.dist + '/assets/css/bundle.min.css' ] )
		.pipe( concat( 'editor.min.css' ) )
		.pipe( gulp.dest( config.dist + '/assets/css/' ) );
} );

gulp.task( 'jsmin-media', function( cb ) {
	pump(
		[
			gulp.src( [ '!' + config.src + 'assets/js/media/**/*.min.js', config.src + 'assets/js/media/**/*.js' ] ),
			uglify(),
			rename( {
				suffix: '.min'
			} ),
			gulp.dest( config.dist + 'assets/js/media' )
		],
		cb
	);
} );

gulp.task( 'jsmin-editor', function( cb ) {
	pump(
		[
			gulp.src( [ '!' + config.src + 'assets/js/editor/**/*.min.js', config.src + 'assets/js/editor/**/*.js' ] ),
			uglify(),
			rename( {
				suffix: '.min'
			} ),
			gulp.dest( config.dist + 'assets/js/editor' )
		],
		cb
	);
} );

gulp.task( 'build', function( cb ) {
	sequence( [ 'sass', 'jsmin-editor', 'jsmin-media' ], [ 'boldgrid-components' ], cb );
} );

gulp.task( 'watch', function() {
	gulp.watch( config.src + 'assets/scss/**/*', [ 'sass' ] );
} );

gulp.task( 'test-watch', function( done ) {
	new server(
		{
			configFile: __dirname + '/karma.conf.js'
		},
		done
	).start();
} );
