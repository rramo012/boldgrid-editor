/**
 * Automatically Copies Deps from Framework:
 * FontAwesome
 * jquery-stellar
 * components.css
 * bootstrap.min.css
 * font-family-controls.min.css
 */

var gulp    = require( 'gulp' ),
    uglify  = require( 'gulp-uglify' ),
    cssnano = require( 'gulp-cssnano' ),
    rename  = require( 'gulp-rename' ),
    sass    = require( 'gulp-sass' ),
	debug    = require( 'gulp-debug' ),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    phpcbf = require('gulp-phpcbf'),
    jshint   = require( 'gulp-jshint' ),
    inject = require('gulp-inject-string'),
    sequence = require('run-sequence'),
    stylish = require('jshint-stylish'),
    jasmine = require('gulp-jasmine'),
    fs = require('fs'),
    autoprefixer = require('gulp-autoprefixer'),
	bower    = require( 'gulp-bower' ),
	server = require('karma').Server,
	phpcs = require('gulp-phpcs'),
	gutil = require('gutil'),
	readme = require('gulp-readme-to-markdown'),
	pump = require('pump');

// Configs.
var config = {
    src:  './',
    dist: './',
	bower : './bower_components',
	fontDest : './assets/fonts',
	cssDest : './assets/css',
	jsDest : './assets/js',
};

gulp.task( 'js-unit-tests', function (done) {
	return new server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done ).start();
});

//Download framework.
gulp.task('bower', function () {
	  return bower().pipe( gulp.dest( config.bower ) );
});

gulp.task('readme', function() {
	
	var badges = [
	   '[![Build Status](https://travis-ci.org/BoldGrid/boldgrid-editor.svg?branch=master)](https://travis-ci.org/BoldGrid/boldgrid-editor)', 
	   '[![License](https://img.shields.io/badge/license-GPL--2.0%2B-orange.svg)](https://raw.githubusercontent.com/BoldGrid/boldgrid-editor/master/LICENSE)', 
	   '[![PHP Version](https://img.shields.io/badge/PHP-5.3%2B-blue.svg)](https://php.net)', 
	   '[![Code Climate](https://codeclimate.com/github/BoldGrid/boldgrid-editor/badges/gpa.svg)](https://codeclimate.com/github/BoldGrid/boldgrid-editor)' 
    ];
	
	gulp.src( [ 'readme.txt' ] )
		.pipe(readme())
		.pipe( inject.prepend( badges.join('\n') + '\n\n' ) )
		.pipe(gulp.dest('.'));
});

gulp.task( 'add-git-badges', function ( cb ) {
	return gulp.src( './tets.md/README.md' )
	    .pipe( debug({title: 'Font Controls:'}) )
		.pipe( inject.append('lkdgskldfjgl;skdfhglk;sdfjgl;ksfjdglkj') )
		.pipe( gulp.dest('./tets.md/README.md') );
} );

gulp.task('phpcbf-includes', function () {
	return gulp.src( [
		  'includes/class-boldgrid-editor-assets.php',
		  ])
		  .pipe(phpcbf({
			  bin: 'phpcbf',
			  standard: 'WordPress',
			  warningSeverity: 0
		  }))
		  .on('error', gutil.log)
		  .pipe(gulp.dest('includes'));
	});

gulp.task('phpcbf-builder', function () {
	  return gulp.src( [
			'includes/builder/**/*.php',
			'!*/**/index.php'
		])
	  .pipe(phpcbf({
	    bin: 'phpcbf',
        standard: 'WordPress',
	    warningSeverity: 0
	  }))
	  .on('error', gutil.log)
	  .pipe(gulp.dest('includes/builder'));
});

gulp.task('phpcs', function () {
    return gulp.src( [
			'includes/class-boldgrid-editor-assets.php',
			'includes/builder/**/*.php',
			'!*/**/index.php'
		])
        // Validate files using PHP Code Sniffer.
        .pipe(phpcs({
            bin: 'phpcs',
            standard: 'WordPress',
            warningSeverity: 0
        }))
        // Log all problems that was found
        .pipe( phpcs.reporter('log') );
});

gulp.task('font-awesome', function () {
	gulp.src( [
			config.bower + '/font-awesome/fonts/**/*',
		] )
		.pipe( debug({title: 'Font Awesome Fonts:'}) )
		.pipe( gulp.dest( config.fontDest ) );
	
	gulp.src( [
	   		config.bower + '/font-awesome/css/font-awesome.min.css',
	   	] )
	   	.pipe( debug({title: 'Font Awesome CSS:'}) )
	   	.pipe( gulp.dest( config.cssDest ) );
});

gulp.task('boldgrid-components', function () {
	gulp.src( [
		config.bower + '/boldgrid-theme-framework/boldgrid-theme-framework/assets/css/components.*'
   ] )
   .pipe( debug({title: 'BoldGrid Components:'}) )
   .pipe( gulp.dest( config.cssDest ) );
	
	gulp.src( [
	    config.bower + '/boldgrid-theme-framework/boldgrid-theme-framework/assets/css/bootstrap/bootstrap.min.css'
	] )
	.pipe( debug({title: 'Bootstrap:'}) )
	.pipe( gulp.dest( config.cssDest ) );
	
	gulp.src( [
	    config.bower + '/boldgrid-theme-framework/boldgrid-theme-framework/assets/css/customizer/font-family-controls.min.css'
	] )
    .pipe( debug({title: 'Font Controls:'}) )
    .pipe( gulp.dest( config.cssDest ) );
});

gulp.task('copy-parallax-js', function () {
	gulp.src( [
		config.bower + '/jquery.stellar/jquery.stellar.js',
		config.bower + '/jquery.stellar/jquery.stellar.min.js'
	] )
	.pipe( debug( {title: 'jQuery Stellar:'} ) )
	.pipe( gulp.dest( config.jsDest + '/jquery-stellar' ) );
});

// Compile sass files.
gulp.task( 'sass', function(  ) {
	  gulp.src( [
	    config.dist + '/assets/scss/**/*.scss'] )
	    .pipe( sass( {
	      includePaths: [
	        config.dist + 'assets/scss/',
	      ]
	    } ).on( 'error', sass.logError ) )
	    .pipe( sass.sync(  ).on( 'error', sass.logError ) )
	    .pipe( gulp.dest( config.dist + '/assets/css' ) )
	    .pipe( cssnano( {
	        discardComments: { removeAll: true },
	        zindex: false
	      } ) )
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
         }))
	    .pipe( rename( { suffix: '.min' } ) )
	    .pipe( gulp.dest( config.dist + '/assets/css' ) );
} );

gulp.task( 'jsmin-drag', function ( cb ) {
	pump( [
		gulp.src( [ 
			config.src + 'assets/js/builder/**/*.js',
			config.src + 'assets/js/jquery/**/*.js',
		] ),
		 jshint(),
		jshint.reporter( stylish ),
		//jshint.reporter( 'fail' ),
		concat( 'editor.js' ),
		uglify(),
		rename( {
			suffix: '.min'
		} ),
		gulp.dest(  config.dist + 'assets/js' )
    ],
    cb
  );
} );
gulp.task( 'jsmin-media', function ( cb ) {
	pump( [
		gulp.src( [ 
			'!' + config.src + 'assets/js/media/**/*.min.js',
			config.src + 'assets/js/media/**/*.js'
		] ),
		uglify(),
		rename( {
			suffix: '.min'
		} ),
		gulp.dest(  config.dist + 'assets/js/media' )
	],
	cb
	);
} );

gulp.task( 'jsmin-editor', function ( cb ) {
	pump( [
	       gulp.src( [
				'!' + config.src + 'assets/js/editor/**/*.min.js',
				config.src + 'assets/js/editor/**/*.js'
			] ),
	       uglify(),
	       rename( {
	    	   suffix: '.min'
	       } ),
	       gulp.dest(  config.dist + 'assets/js/editor' )
	       ],
	       cb
	);
} );

gulp.task( 'default', function ( cb ) {
	sequence (
		[ 'bower', 'sass', 'jsmin-editor', 'jsmin-media', 'jsmin-drag', 'phpcbf-includes', 'phpcbf-builder', 'readme' ],
		[ 'font-awesome', 'boldgrid-components', 'copy-parallax-js', 'phpcs' ],
		cb
	);
});

gulp.task('watch', function() {
	gulp.watch( config.src + 'assets/scss/**/*', [ 'sass' ] );
} );


gulp.task('test-watch', function (done) {
	new server({
		configFile: __dirname + '/karma.conf.js',
	}, done).start();
} );
