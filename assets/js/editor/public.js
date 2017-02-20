( function( $ ) {

	$( function() {
		onload();
	} );

	function onload() {
		$( '.background-parallax' )
			.attr( 'data-stellar-background-ratio', '.3' )
			.css( 'background-position-x', 0 );

		$( 'body' ).stellar();
	};

} )( jQuery );
