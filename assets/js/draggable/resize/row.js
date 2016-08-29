var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.RESIZE = BOLDGRID.EDITOR.RESIZE || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.RESIZE.Row = {

		$body : null,
		handleSize : 20,
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
			
			self.hideHandles();
		},
		
		initDraggable : function () {
			var startPadding, setting,
				$body = self.$container.find( 'body' );

			self.$container.find( '.draghandle' ).draggable( {
				scroll: false,
				axis: 'y',
				start : function ( e, ui ) {
					self.currentlyDragging = true;
					setting = $( this ).data( 'setting' );
					startPadding = parseInt( self.$currentRow.css( setting ) );
					self.$currentRow.addClass( 'changing-padding' );
					$body.addClass( 'no-select-imhwpb' ).addClass( 'changing-' + setting );
				},
				stop : function ( e, ui ) {
					self.currentlyDragging = false;
					self.$currentRow.removeClass( 'changing-padding' );
					$body.removeClass( 'no-select-imhwpb' ).removeClass( 'changing-' + setting );
				},
				drag : function ( e, ui ) {
					var padding, rowPos, relativePos,
						diff = ui.position.top - ui.originalPosition.top;

					if ( 'padding-top' == setting ) {
						padding = parseInt( self.$currentRow.css( setting ) ) - diff;
						relativePos = 'top';
						if ( padding > 0 ) {
							window.scrollBy( 0, - diff );
						}
					} else {
						padding = startPadding + diff;
						relativePos = 'bottom';
					}

					// If padding is less than 0, prevent movement of handle.
					if ( padding < 0 ) {
						rowPos = self.$currentRow[0].getBoundingClientRect();
						ui.position.top = rowPos[ relativePos ] - self.handleOffset;
					} else {
						BG.Controls.addStyle( self.$currentRow, setting, padding );
					}

					if ( $body.hasClass( 'editing-as-row' ) && $.fourpan ) {
						$.fourpan.refresh();
					}
				}
			} );
		},

		bindHandlers : function () {
			self.$container.on( 'mouseenter', '.row:not(.row .row):not(.editing-as-row .row)', self.positionHandles );
			self.$container.on( 'mouseleave', '.row:not(.row .row):not(.editing-as-row .row)', self.hideHandles );
			self.$container.on( 'mouseenter', '.editing-as-row .row .row:not(.row .row .row)', self.positionHandles );
			self.$container.on( 'mouseleave', '.editing-as-row .row .row:not(.row .row .row)', self.hideHandles );
			self.$container.on( 'edit-as-row-enter', self.hideHandles );
			self.$container.on( 'edit-as-row-leave', self.hideHandles );
			self.$container.on( 'boldgrid_modify_content', self.positionHandles );
		},
		positionHandles : function() {
			var pos, $this, rightOffset;
			
			if ( this.getBoundingClientRect ) {
				$this = $( this );
			} else {
				$this = self.$currentRow;
			}
			
			pos = $this[0].getBoundingClientRect();
			rightOffset = pos.right - 100;

			if ( self.currentlyDragging ) {
				return false;
			}

			// Save the current row.
			self.$currentRow = $this;

			self.$topHandle.css( {
				'top' : pos.top - self.handleOffset,
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