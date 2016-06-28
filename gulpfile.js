var gulp    = require( 'gulp' ),
    uglify  = require( 'gulp-uglify' ),
    cssnano = require( 'gulp-cssnano' ),
    rename  = require( 'gulp-rename' ),
    sass    = require( 'gulp-sass' );


// Configs.
var config = {
    src:  './',
    dist: './',
};

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
	    .pipe( rename( { suffix: '.min' } ) )
	    .pipe( gulp.dest( config.dist + '/assets/css' ) );
} );

// Build.
gulp.task( 'default', [ 'scssCompile' ] );
