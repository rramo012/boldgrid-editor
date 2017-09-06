( function( $ ) {
	$( function() {
		onload();
	} );

	function onload() {
		var $parallaxBackgrounds = $( '.background-parallax' );

		if ( $parallaxBackgrounds.length ) {
			$parallaxBackgrounds
				.attr( 'data-stellar-background-ratio', '.3' )
				.css( 'background-position-x', 0 );

			$( 'body' ).stellar();
		}
	}
} ( jQuery ) );
