var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.RESIZE = BOLDGRID.EDITOR.RESIZE || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.RESIZE.Row = {

		$body : null,
		
		handleSize : 14,
		
		$container : null,
		
		$topHandle : null,
		
		$bottomHandle : null,
		
		handleOffset: null,
		
		currentlyDragging: false,
		
		$currentRow : null,

		/**
		 * Initialize Row Resizing.
		 * This control adds padding top and bottom to containers.
		 * 
		 * @since 1.2.7
		 */
		init : function ( $container ) {
			self.$container = $container;
			self.handleOffset = self.handleSize;
			self.createHandles();
			self.bindHandlers();
			self.initDraggable();
		},
		
		/**
		 * Bind all events.
		 * 
		 * @since 1.2.7
		 */
		bindHandlers : function () {
			self.$container
				.on( 'mouseenter', '.row:not(.row .row):not(.editing-as-row .row)', self.positionHandles )
				.on( 'mouseleave', '.row:not(.row .row):not(.editing-as-row .row)', self.hideHandles )
				.on( 'mouseenter', '.editing-as-row .row .row:not(.row .row .row)', self.positionHandles )
				.on( 'mouseleave', '.editing-as-row .row .row:not(.row .row .row)', self.hideHandles )
				.on( 'edit-as-row-enter', self.hideHandles )
				.on( 'edit-as-row-leave', self.hideHandles )
				.on( 'boldgrid_modify_content', self.positionHandles )
				.on( 'mouseleave', self.hideHandles )
				.on( 'end_typing_boldgrid.draggable', self.positionHandles );
		},
		
		/**
		 * Attach drag handle controls to the DOM.
		 * 
		 * @since 1.2.7
		 */
		createHandles : function () {

			self.$topHandle = $( '<span class="draghandle top" title="Drag Resize Row" data-setting="padding-top"></span>' );
			self.$bottomHandle = $( '<span class="draghandle bottom" title="Drag Resize Row" data-setting="padding-bottom"></span>' );

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
			
			self.hideHandles();
		},
		
		/**
		 * Handle the drag events.
		 * 
		 * @since 1.2.7
		 */
		initDraggable : function () {
			var startPadding, setting,
				$body = self.$container.$body;

			self.$container.find( '.draghandle' ).draggable( {
				scroll: false,
				axis: 'y',
				start : function ( e, ui ) {
					self.currentlyDragging = true;
					setting = $( this ).data( 'setting' );
					startPadding = parseInt( self.$currentRow.css( setting ) );
					self.$currentRow.addClass( 'changing-padding' );
					self.$container.$html.addClass( 'no-select-imhwpb' );
					self.$container.$html.addClass( 'changing-' + setting );
				},
				stop : function ( e, ui ) {
					self.currentlyDragging = false;
					self.$currentRow.removeClass( 'changing-padding' );
					self.$container.$html.removeClass( 'no-select-imhwpb' );
					self.$container.$html.removeClass( 'changing-' + setting );
				},
				drag : function ( e, ui ) {
					var padding, rowPos, relativePos,
						diff = ui.position.top - ui.originalPosition.top;

					if ( 'padding-top' == setting ) {
						padding = parseInt( self.$currentRow.css( setting ) ) - diff;
						relativePos = 'top';
						if ( padding > 0 && diff ) {
							window.scrollBy( 0, - diff );
						}
					} else {
						padding = startPadding + diff;
						relativePos = 'bottom';
					}

					// If padding is less than 0, prevent movement of handle.
					if ( padding < 0 ) {
						rowPos = self.$currentRow[0].getBoundingClientRect();
						ui.position.top = rowPos[ relativePos ] - (  ui.helper.hasClass('top') ? 0 : self.handleOffset );
						padding = 0;
					}
					
					BG.Controls.addStyle( self.$currentRow, setting, padding );

					if ( self.$container.$html.hasClass( 'editing-as-row' ) && $.fourpan ) {
						$.fourpan.refresh();
					}
				}
			} );
		},

		/**
		 * Reposition the handles.
		 * 
		 * @since 1.2.7
		 */
		positionHandles : function() {
			var pos, $this, rightOffset;
			
			if ( this.getBoundingClientRect ) {
				$this = $( this );
			} else {
				$this = self.$currentRow;
			}
			
			if ( ! $this || ! $this.length || false === $this.is(':visible') ) {
				self.$topHandle.hide();
				self.$bottomHandle.hide();
				return;
			}
			
			pos = $this[0].getBoundingClientRect();
			rightOffset = pos.right - 100;

			if ( self.currentlyDragging ) {
				return false;
			}

			// Save the current row.
			self.$currentRow = $this;

			self.$topHandle.css( {
				'top' : pos.top /*+ self.handleOffset*/,
				'left' : rightOffset
			} );

			self.$bottomHandle.css( {
				'top' : pos.bottom - self.handleOffset,
				'left' : rightOffset
			} );
			
			if ( this.getBoundingClientRect ) {
				self.$topHandle.show();
				self.$bottomHandle.show();
			}
		},

		/**
		 * Hide the drag handles.
		 * 
		 * @since 1.2.7
		 */
		hideHandles : function ( e ) {
			var $this = $( this );

			if ( e && e.relatedTarget && $( e.relatedTarget ).hasClass('draghandle') ) {
				return;
			}

			if ( self.currentlyDragging ) {
				return false;
			}

			self.$topHandle.hide();
			self.$bottomHandle.hide();
		}

	};

	self = BOLDGRID.EDITOR.RESIZE.Row;

} )( jQuery );