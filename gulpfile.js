/**
 * Automatically Copies Deps from Framework:
 * FontAwesome
 * jquery-stellar
 * components.css
 */

var gulp    = require( 'gulp' ),
    uglify  = require( 'gulp-uglify' ),
    cssnano = require( 'gulp-cssnano' ),
    rename  = require( 'gulp-rename' ),
    sass    = require( 'gulp-sass' ),
	debug    = require( 'gulp-debug' ),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    phpcbf = require('gulp-phpcbf'),
    jshint   = require( 'gulp-jshint' ),
    sequence = require('run-sequence'),
    stylish = require('jshint-stylish'),
    autoprefixer = require('gulp-autoprefixer'),
	bower    = require( 'gulp-bower' ),
	phpcs = require('gulp-phpcs'),
	gutil = require('gutil'),
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

//Download framework.
gulp.task('bower', function () {
	  return bower().pipe( gulp.dest( config.bower ) );
});

gulp.task('phpcbf', function () {
	  return gulp.src(['src/**/*.php', '!src/vendor/**/*.*'])
	  .pipe(phpcbf({
	    bin: 'phpcbf',
        standard: 'WordPress',
	    warningSeverity: 0
	  }))
	  .on('error', gutil.log)
	  .pipe(gulp.dest('src'));
	});

gulp.task('phpcs', function () {
    return gulp.src( ['includes/**/*.php', '!src/vendor/**/*.*'])
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

// Build.
gulp.task( 'default', function ( cb ) {
	sequence (
		[ 'bower', 'sass', 'jsmin-editor', 'jsmin-media', 'jsmin-drag' ],
		[ 'font-awesome', 'boldgrid-components', 'copy-parallax-js' ],
		cb
	);
});

gulp.task('watch', function() {
	gulp.watch( config.src + 'assets/scss/**/*', [ 'sass' ] );
} );
