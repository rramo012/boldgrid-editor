var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles adding gridblocks.
 */
( function( $ ) {
	'use strict';

	var self = {

		$window: $( window ),

		init: function() {
			self.setupInsertClick();
		},

		setupInsertClick: function() {
			$( '.boldgrid-zoomout-section' ).on( 'click', '.add-gridblock', self.onGridblockClick );
		},

		onGridblockClick: function() {
			var $this = $( this ), $placeHolder,
				gridblockId = $this.closest( '.gridblock' ).attr( 'data-id' ),
				selectedHtml = BOLDGRID.EDITOR.GRIDBLOCK.Create.getHtml( gridblockId );

			$placeHolder = self.insertPlaceHolder();

			// Insert into page aciton.
			if ( 'string' !== typeof selectedHtml ) {
				selectedHtml.always( function( html ) {
					//Ignore history until always returns.
					self.sendGridblock( html, $placeHolder );
				} );
			} else {
				self.sendGridblock( selectedHtml, $placeHolder );
			}

		},

		insertPlaceHolder: function( $placeHolder ) {
			var $body = IMHWPB.WP_MCE_Draggable.draggable_instance.$body,
				$placeHolder = $( '<div class="boldgrid-section loading-gridblock">Installing GridBlock</div>' );

			$body.prepend( $placeHolder );

			return $placeHolder;
		},

		sendGridblock: function( html, $placeHolder ) {
			var $inserting = $( html ),
				draggable = IMHWPB.WP_MCE_Draggable.draggable_instance;

			if ( ! $inserting || ! draggable ) {
				send_to_editor( $inserting[0].outerHTML );
			}

			// If current selection is inside of a row, insert above that row. Insert at top of row.
			$placeHolder.replaceWith( $inserting );
			draggable.validate_markup();

			tinymce.activeEditor.fire( 'setContent' );
			tinymce.activeEditor.focus();

			setTimeout( function() {
				BOLDGRID.EDITOR.CONTROLS.Add.scrollToElement( $inserting, 0 );
			} );
			self.$window.trigger( 'resize' );
		}

	};

	BOLDGRID.EDITOR.GRIDBLOCK.Add = self;
	$( BOLDGRID.EDITOR.GRIDBLOCK.Add.init );

} )( jQuery );
