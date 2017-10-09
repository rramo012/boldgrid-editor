let $ = jQuery;

window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR.$window = $( window );

// Require jquery plugins.
import 'istyping';
import 'fourpan';
import 'textselect';
import 'jquery-slimScroll';
import 'wp-color-picker-alpha/src/wp-color-picker-alpha.js';

// Import Libs.
import './builder/tinymce/wp-mce-draggable';
import './builder/util';

// Require all Builder files.
function requireAll( r ) {
	r.keys().forEach( r );
}
requireAll( require.context( './builder/', true, /\.js$/ ) );
