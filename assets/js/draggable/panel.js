var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self;

	BOLDGRID.EDITOR.Panel = {

		$element : null,

		/**
		 * Initialize the panel.
		 *
		 * @since 1.3
		 *
		 * @return jQuery $this.$element Panel Element
		 */
		init : function () {

			this.create();
			this._setupPanelClose();
			this._setupDrag();
			//this._setupPanelResize();

			return this.$element;
		},

		/**
		 * Create Panel HTML.
		 *
		 * @since 1.3
		 */
		create : function () {
			this.$element = $( BoldgridEditor.instancePanel );
			$( 'body' ).append( this.$element );
		},

		/**
		 * Setup Scrolling within the panel.
		 *
		 * @since 1.3
		 */
		initScroll : function ( control ) {
			var target = '.panel-body',
				sizeOffset = -66;
			
			if ( control.panel && control.panel.scrollTarget ) {
				target = control.panel.scrollTarget;
			}

			if ( control.panel && control.panel.sizeOffset ) {
				sizeOffset = control.panel.sizeOffset;
			}

			$(".panel-body").slimScroll({destroy: true}).attr('style', '');
			this.$element.find( target ).slimScroll( {
			    color: '#32373c',
			    size: '7px',
			    height: parseInt( control.panel.height ) + sizeOffset,
			    wheelStep: 5,
			} );
		},

		/**
		 * Check if a control is currently open.
		 *
		 * @since 1.3
		 */
		isOpenControl : function ( control ) {
			var isOpenControl = false;

			if ( this.$element.is( ':visible' ) && this.$element.attr( 'data-type' ) == control.name ) {
				isOpenControl = true;
			}

			return isOpenControl;
		},

		/**
		 * Initialize dragging of the panel.
		 *
		 * @since 1.3
		 */
		_setupDrag : function() {
			this.$element.draggable( {
				containment: '#wpwrap',
				handle: '.panel-title',
				scroll : false
			} );
		},

		/**
		 * Remove all selected options.
		 *
		 * @since 1.3
		 */
		clearSelected : function () {
			BOLDGRID.EDITOR.Panel.$element.find( '.selected' ).removeClass( 'selected' );
		},

		/**
		 * Setup resizing of the panel.
		 *
		 * @since 1.3
		 */
		_setupPanelResize : function() {
			this.$element.resizable();
		},

		/**
		 * Setup resizing of the panel.
		 *
		 * @since 1.3
		 */
		_setupPanelClose : function() {
			this.$element.on( 'click', '.close-icon', function () {
				self.closePanel();
			} );
		},

		closePanel : function () {
			self.$element.hide();
			BOLDGRID.EDITOR.Menu.deactivateControl();
		},

		_scrollToSelected : function () {
			var $selected = self.$element.find( '.selected' );

			this.$element.find( '.panel-body' ).scrollTop( 0 );

			if ( ! $selected.length ) {
				return;
			}

			this.$element.find( '.panel-body' )
				.scrollTop( $selected.position().top - ( self.$element.height() / 2 ) );
		},

		clear : function () {
			this.$element.find( '.panel-title .name' ).empty();
			this.$element.find( '.panel-body' ).empty();
		},

		/**
		 * Open a panel for a control
		 */
		open : function ( control ) {

			BOLDGRID.EDITOR.Menu.activateControl( control );

			this.$element.height( control.panel.height );
			this.$element.width( control.panel.width );
			this.$element.find( '.panel-title .name' ).html( control.panel.title );
			this.$element.attr( 'data-type', control.name );
			this.$element.show();
			this.initScroll( control );
			this._scrollToSelected();
		}

	};

	self = BOLDGRID.EDITOR.Panel;

} )( jQuery );