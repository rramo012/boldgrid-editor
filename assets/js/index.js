window.BOLDGRID = window.BOLDGRID || {};

function requireAll( r ) {
	r.keys().forEach( r );
}
requireAll( require.context( './builder/', true, /\.js$/ ) );

jQuery( function() {
	console.log( BOLDGRID );
} );

export default {
	'hdhdh': 'ddd'
};
