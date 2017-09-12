window.BOLDGRID = window.BOLDGRID || {};

// Require jquery plugins.
import 'istyping';
import 'fourpan';
import 'textselect';
import 'jquery-slimScroll';
import 'wp-color-picker-alpha';

// Import Libs.
import './builder/util';


// Require all Builder files.
function requireAll( r ) {
	r.keys().forEach( r );
}
requireAll( require.context( './builder/', true, /\.js$/ ) );
