var gulp    = require( 'gulp' ),
    uglify  = require( 'gulp-uglify' ),
    cssnano = require( 'gulp-cssnano' ),
    rename  = require( 'gulp-rename' ),
    sass    = require( 'gulp-sass' ),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint   = require( 'gulp-jshint' ),
    stylish = require('jshint-stylish'),
    autoprefixer = require('gulp-autoprefixer'),
	pump = require('pump');

// Configs.
var config = {
    src:  './',
    dist: './',
};

// Compile sass files.
gulp.task( 'scssCompile', function(  ) {
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
		    config.src + 'assets/js/render-fonts.js',
			config.src + 'assets/js/draggable/**/*.js',
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
gulp.task( 'default', 
	[ 'scssCompile', 'jsmin-editor', 'jsmin-media', 'jsmin-drag' ]
);

gulp.task('watch', function() {
	gulp.watch( config.src + 'assets/scss/**/*', [ 'scssCompile' ] );
} );
