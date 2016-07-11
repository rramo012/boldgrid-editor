var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.RESIZE = BOLDGRID.EDITOR.RESIZE || {};

( function ( $ ) {
	"use strict";

	var self;

	BOLDGRID.EDITOR.RESIZE.Row = {

		$body : $( 'body' ),
		handleSize : 25,
		$container : null,
		$topHandle : null,
		$bottomHandle : null,
		handleOffset: null,
		currentlyDragging: false,
		$currentRow : null,

		init : function ( $container ) {
			self.$container = $container;
			self.handleOffset = self.handleSize / 2;
			self.createHandles();
			self.bindHandlers();
			self.initDraggable();
		},
		createHandles : function () {

			self.$topHandle = $( '<span class="draghandle top" data-setting="padding-top"></span>' );
			self.$bottomHandle = $( '<span class="draghandle bottom" data-setting="padding-bottom"></span>' );

			$.each( [ self.$topHandle, self.$bottomHandle ], function () {
				this.css( {
					'position' : 'fixed',
					'height' : self.handleSize,
					'width' : self.handleSize,
				} );
			} );

			self.$container.find( 'body' )
				.after( self.$topHandle )
				.after( self.$bottomHandle );
		},
		initDraggable : function () {
			self.$container.find( '.draghandle' ).draggable( {
				axis: 'y',
				start : function ( e, ui ) {
					self.currentlyDragging = true;
				},
				stop : function ( e, ui ) {
					self.currentlyDragging = false;
				},
				drag : function ( e, ui ) {
					//scroll the page down at the same time that you add padding
					var padding,
						$this = $( this ),
						diff = ui.position.top - ui.originalPosition.top,
						setting = $this.data('setting');

					if ( 'padding-top' == setting ) {
						diff = 0 - diff;
					}

					padding = Math.max( diff, 0 );

					self.$currentRow.css( setting, padding + 'px' );
				}
			} );
		},
		bindHandlers : function () {
			self.$container.on( 'mouseenter', '.row:not(.row .row)', self.positionHandles );
			self.$container.on( 'mouseleave', '.row:not(.row .row)', self.hideHandles );
		},
		positionHandles : function() {
			var pos = this.getBoundingClientRect(),
				$this = $( this ),
				rightOffset = pos.right - 100 + 'px';

			if ( self.currentlyDragging ) {
				return false;
			}

			// Save the current row.
			self.$currentRow = $this;

			self.$topHandle.css( {
				'top' : pos.top - self.handleOffset,
				'left' : rightOffset
			} ).show();

			self.$bottomHandle.css( {
				'top' : pos.bottom - self.handleOffset,
				'left' : rightOffset
			} ).show();

		},
		hideHandles : function () {
			var $this = $( this );

			if ( self.currentlyDragging ) {
				return false;
			}

			//self.$topHandle.hide();
			//self.$bottomHandle.hide();
		}

	};

	self = BOLDGRID.EDITOR.RESIZE.Row;

} )( jQuery );