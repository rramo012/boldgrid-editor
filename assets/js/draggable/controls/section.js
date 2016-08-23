var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Section = {
		
		$container : null,

		$popover : null,
		
		$currentSection : [],
			
		init : function ( $container ) {
			self.$container = $container;
			self.createHandles();
			self.bindHandlers();
		},
		
		hideHandles : function ( e ) {

			if ( e && e.relatedTarget && $( e.relatedTarget ).closest('.section-popover').length ) {
				return;
			}
			
			self.$popover.find('.popover-menu-imhwpb').addClass('hidden');
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
			self.$popover.on( 'click', '[data-action]', self.hideHandles );
			self.$popover.on( 'click', '[data-action="delete"]', self.deleteSection );
			self.$popover.on( 'click', '[data-action="duplicate"]', self.clone );
			self.$popover.on( 'click', '[data-action="move-up"]', self.moveUp );
			self.$popover.on( 'click', '[data-action="move-down"]', self.moveDown );
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
				'left' : '50%',
				'transform' :  'translateX(-50%)'
			} ).show();
		},
		
		deleteSection : function () {
			self.$currentSection.remove();
			self.$container.trigger( self.$container.delete_event );
		},
		
		clone : function () {
			self.$currentSection.after( self.$currentSection.clone() );
			self.$container.trigger( self.$container.delete_event );
		},
		moveUp : function () {
			var $prev = self.$currentSection.prev();
			
			if ( $prev.length ) {
				$prev.before( self.$currentSection );
			
			}
			self.$container.trigger( self.$container.delete_event );
		},
		moveDown : function () {
			var $next = self.$currentSection.next();
			
			if ( $next.length ) {
				$next.after( self.$currentSection );
			}
			
			self.$container.trigger( self.$container.delete_event );
		}
		
	};

	self = BOLDGRID.EDITOR.CONTROLS.Section;

} )( jQuery );