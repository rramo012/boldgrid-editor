var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self;

	BOLDGRID.EDITOR.Panel = {

		$element : null,

		/**
		 * Initialize the panel.
		 */
		init : function () {

			this.create();
			this.onPanelClose();
			this._setupDrag();
			//this.setupPanelResize();

			return this.$element;
		},
		create : function () {
			this.$element = $( BoldgridEditor.instancePanel );
			$( 'body' ).append( this.$element );
		},

		initScroll : function () {

			this.$element.find( '.panel-body' ).slimScroll( {
			    color: '#32373c',
			    size: '7px',
			  //66px styling offset.
			    height: this.$element.height() - 66,
			    wheelStep: 5,
			} );
		},

		isOpenControl : function ( control ) {
			var isOpenControl = false;

			if ( this.$element.is( ':visible' ) && this.$element.attr( 'data-type' ) == control.name ) {
				isOpenControl = true;
			}

			return isOpenControl;
		},

		_setupDrag : function() {
			this.$element.draggable( {
				containment: '#wpwrap',
				handle: '.panel-title',
				scroll : false
			} );
		},

		clearSelected : function () {
			BOLDGRID.EDITOR.Panel.$element.find( '.selected' ).removeClass( 'selected' );
		},

		setupPanelResize : function() {
			this.$element.resizable();
		},

		onPanelClose : function() {
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
			this.initScroll();
			this._scrollToSelected();
		}

	};

	self = BOLDGRID.EDITOR.Panel;

} )( jQuery );