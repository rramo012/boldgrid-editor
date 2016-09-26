( function ( $ ) {

	$( function () {
		onload();
	} );

	function onload() {
		$('.background-parallax').attr( 'data-stellar-background-ratio', '.3' );
		$('body').stellar();
	};

} )( jQuery );
