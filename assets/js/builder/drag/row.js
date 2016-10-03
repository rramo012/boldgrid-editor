var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.DRAG = BOLDGRID.EDITOR.DRAG || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.DRAG.Row = {
			
		dragEnter : function ( $dragEntered ) {
			var $dragEntered = self.remapDragEnter( $dragEntered ),
				validDrag = self.validateDragEnter( $dragEntered );

			if ( validDrag ) {
				self.moveIntoSection( $dragEntered );
				BG.Controls.$container.recalc_row_pos();
				BG.Controls.$container.trigger( BG.Controls.$container.boldgrid_modify_event );
			}
		},
		
		remapDragEnter : function ( $dragEntered ) {
			var $parentSection = $dragEntered.closest('.boldgrid-section');
			
			if ( $parentSection.length ) {
				$dragEntered = $parentSection;
			}
			
			return $dragEntered;
		},
		
		/**
		 * If Drag Entered is a section.
		 *    And Drag Enetered doesnt have any rows in it.
		 *    And Section has container.
		 */
		validateDragEnter : function ( $dragEntered ) {
			var validDrag;

			validDrag = $dragEntered.hasClass( 'boldgrid-section' ) &&
				0 === $dragEntered.find( '.row:not(.dragging-imhwpb)' ).not(BG.Controls.$container.$current_drag).length &&
				0 !== $dragEntered.find( '.container-fluid, .container' ).length;
			
			console.log( $dragEntered, $dragEntered.find( '.row:not(.dragging-imhwpb)' ).html() )
			
			return validDrag;
		},
		
		moveIntoSection : function ( $dragEntered ) {
			console.log("Move");
			// Prepend Row into sections container.
			$dragEntered.find( '.container-fluid, .container' )
				.first()
				.prepend( BG.Controls.$container.$temp_insertion );
		}
	
	};

	self = BOLDGRID.EDITOR.DRAG.Row;

} )( jQuery );