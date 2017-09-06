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
	phpcbf = require( 'gulp-phpcbf' ),
	inject = require( 'gulp-inject-string' ),
	sequence = require( 'run-sequence' ),
	jasmine = require( 'gulp-jasmine' ),
	fs = require( 'fs' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	server = require( 'karma' ).Server,
	phpcs = require( 'gulp-phpcs' ),
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

gulp.task( 'readme', function() {
	var badges = [
		'[![Build Status](https://travis-ci.org/BoldGrid/boldgrid-editor.svg?branch=master)](https://travis-ci.org/BoldGrid/boldgrid-editor)',
		'[![License](https://img.shields.io/badge/license-GPL--2.0%2B-orange.svg)](https://raw.githubusercontent.com/BoldGrid/boldgrid-editor/master/LICENSE)',
		'[![PHP Version](https://img.shields.io/badge/PHP-5.3%2B-blue.svg)](https://php.net)',
		'[![Code Climate](https://codeclimate.com/github/BoldGrid/boldgrid-editor/badges/gpa.svg)](https://codeclimate.com/github/BoldGrid/boldgrid-editor)',
		'[![built with gulp](https://img.shields.io/badge/-gulp-eb4a4b.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAYAAAAOCAMAAAA7QZ0XAAAABlBMVEUAAAD%2F%2F%2F%2Bl2Z%2FdAAAAAXRSTlMAQObYZgAAABdJREFUeAFjAAFGRjSSEQzwUgwQkjAFAAtaAD0Ls2nMAAAAAElFTkSuQmCC)](http://gulpjs.com/)'
	];

	gulp
		.src( [ 'readme.txt' ] )
		.pipe( readme() )
		.pipe( inject.prepend( badges.join( '\n' ) + '\n\n' ) )
		.pipe( gulp.dest( '.' ) );
} );

gulp.task( 'phpcbf-includes', function() {
	return gulp
		.src( [ 'includes/class-boldgrid-editor-assets.php' ] )
		.pipe(
			phpcbf( {
				bin: 'phpcbf',
				standard: 'WordPress',
				warningSeverity: 0
			} )
		)
		.on( 'error', gutil.log )
		.pipe( gulp.dest( 'includes' ) );
} );

gulp.task( 'phpcbf-builder', function() {
	return gulp
		.src( [ 'includes/builder/**/*.php', '!*/**/index.php' ] )
		.pipe(
			phpcbf( {
				bin: 'phpcbf',
				standard: 'WordPress',
				warningSeverity: 0
			} )
		)
		.on( 'error', gutil.log )
		.pipe( gulp.dest( 'includes/builder' ) );
} );

gulp.task( 'phpcs', function() {
	return ( gulp
			.src( [
				'includes/class-boldgrid-editor-assets.php',
				'includes/builder/**/*.php',
				'!*/**/index.php'
			] )

			// Validate files using PHP Code Sniffer.
			.pipe(
				phpcs( {
					bin: 'phpcs',
					standard: 'WordPress',
					warningSeverity: 0
				} )
			)

			// Log all problems that was found
			.pipe( phpcs.reporter( 'log' ) ) );
} );

gulp.task( 'font-awesome', function() {
	gulp
		.src( [ 'node_modules/font-awesome/fonts/**/*' ] )
		.pipe( debug( { title: 'Font Awesome Fonts:' } ) )
		.pipe( gulp.dest( config.fontDest ) );

	gulp
		.src( [ 'node_modules/font-awesome/css/font-awesome.min.css' ] )
		.pipe( debug( { title: 'Font Awesome CSS:' } ) )
		.pipe( gulp.dest( config.cssDest ) );
} );

gulp.task( 'boldgrid-components', function() {
	gulp
		.src( [
			config.src +
				'/node_modules/boldgrid-component-library/dist/css/components.*'
		] )
		.pipe( debug( { title: 'BoldGrid Components:' } ) )
		.pipe( gulp.dest( config.cssDest ) );

	gulp
		.src( [
			config.src +
				'/node_modules/boldgrid-component-library/json/components.json'
		] )
		.pipe( debug( { title: 'BoldGrid Components Json:' } ) )
		.pipe( gulp.dest( config.jsonDir ) );

	gulp
		.src( [
			'node_modules/boldgrid-theme-framework/boldgrid-theme-framework/assets/css/customizer/font-family-controls.min.css'
		] )
		.pipe( debug( { title: 'Font Controls:' } ) )
		.pipe( gulp.dest( config.cssDest ) );
} );

gulp.task( 'copy-parallax-js', function() {
	gulp
		.src( [
			'node_modules/jquery.stellar/jquery.stellar.js',
			'node_modules/jquery.stellar/jquery.stellar.min.js'
		] )
		.pipe( debug( { title: 'jQuery Stellar:' } ) )
		.pipe( gulp.dest( config.jsDest + '/jquery-stellar' ) );
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

gulp.task( 'jsmin-media', function( cb ) {
	pump(
		[
			gulp.src( [
				'!' + config.src + 'assets/js/media/**/*.min.js',
				config.src + 'assets/js/media/**/*.js'
			] ),
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
			gulp.src( [
				'!' + config.src + 'assets/js/editor/**/*.min.js',
				config.src + 'assets/js/editor/**/*.js'
			] ),
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
	sequence(
		[ 'sass', 'jsmin-editor', 'jsmin-media', 'readme' ],
		[ 'font-awesome', 'boldgrid-components', 'copy-parallax-js' ],
		cb
	);
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
