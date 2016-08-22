var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Section = {
		
		$container : null,

		$popover : null,
		
		$currentSection : null,
			
		init : function ( $container ) {
			self.$container = $container;
			self.createHandles();
			self.bindHandlers();
		},
		
		hideHandles : function ( e ) {

			if ( e && e.relatedTarget && $( e.relatedTarget ).closest('.section-popover').length ) {
				return;
			}
			self.$popover.hide();
		},
		
		createHandles : function () {

			self.$popover = $( wp.template('boldgrid-editor-drag-handle')() );

			self.$popover.css( {
				'position' : 'fixed',
			} );

			self.$container.find( 'body' ).after( self.$popover );
			
			self.hideHandles();
		},

		bindHandlers : function () {
			self.$container.find('body').on( 'mouseenter', '> .boldgrid-section', self.positionHandles );
			self.$container.find('body').on( 'mouseleave', '> .boldgrid-section', self.hideHandles );
		},
		
		positionHandles : function() {
			var pos = this.getBoundingClientRect(),
				$this = $( this );

			if ( self.currentlyDragging ) {
				return false;
			}

			// Save the current row.
			self.$currentSection = $this;

			self.$popover.css( {
				'top' :  pos.bottom + 35,
				'left' : '50%'
			} ).show();
		},
		
	};

	self = BOLDGRID.EDITOR.CONTROLS.Section;

} )( jQuery );