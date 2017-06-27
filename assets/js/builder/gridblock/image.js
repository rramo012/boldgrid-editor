var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

			translateImages: function( $gridblock ) {
				console.log( $gridblock.find( 'img' ), $gridblock );
				$gridblock.find( 'img' ).each( function() {
					var $this = $( this );

					self.getDataURL( $this.attr( 'src' ) ).done( function( result ) {
						$this.attr( 'src', result );
					} );
				} );
			},

			getDataURL: function( src ) {
				var $deferred = $.Deferred(),
					xhr = new XMLHttpRequest();

				xhr.open( 'get', src );
				xhr.responseType = 'blob';
				xhr.onload = function() {

					var fr = new FileReader();
					fr.onload = function() {
						$deferred.resolve( this.result );
					};

					fr.readAsDataURL( xhr.response );
				};

				xhr.send();

				return $deferred;
			}
		};

	BG.GRIDBLOCK.Image = self;

} )( jQuery );
