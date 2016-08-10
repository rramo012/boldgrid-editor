var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self;

	BOLDGRID.EDITOR.Menu = {

		$element : null,
		$activeElement : null,

		/**
		 * Initialize the panel.
		 */
		init : function () {

			this.create();
			this.setupMenuDrag();

			return this.$element;
		},

		getTarget : function ( control ) {
			return this.$element.targetData[ control.name ];
		},

		create : function () {
			this.$element = $( wp.template( 'boldgrid-editor-control-menu' )() );
			$( '#mceu_34' ).append( this.$element );
		},

		setupMenuDrag : function() {
			this.$element.find( 'ul' ).draggable( {
				containment: '#wp-content-editor-container',
				//handle: '.boldgrid-instance-menu ul',
				scroll : false,
				axis: "x"
			} );
		},

		createListItem : function ( control ) {

			var $dropdownUl,
				$li = $('<li></li>').attr( 'data-action', 'menu-' + control.name ),
				$icon = $( '<span></span>' ).addClass( control.iconClasses );

			$li.append( $icon );
			
			if ( control.menuDropDown ) {
				$dropdownUl = $( '<ul class="bg-editor-menu-dropdown"></ul>' );
				$dropdownUl.html('<li class="title">' + control.menuDropDown.title + '</li>')
				$.each( control.menuDropDown.options, function () {
					$dropdownUl.append( '<li class="' + this['class'] + '">' + this.name + '</li>' );
				} ); 
				$li.append( $dropdownUl );
			}
			
			if ( control.tooltip ) {
				$li.append( wp.template( 'boldgrid-editor-tooltip' )( { 
					'message' : control.tooltip
				} ) );
			}

			this.$element.find( '> ul' ).append( $li );
		},

		activateControl : function ( control ) {
			self.deactivateControl();
			this.$activeElement = BOLDGRID.EDITOR.Menu.$element
				.find( '[data-action="menu-' + control.name + '"]')
				.addClass( 'active' );

		},

		deactivateControl : function () {
			if ( this.$activeElement ) {
				this.$activeElement.removeClass( 'active' );
				this.$activeElement = null;
			}
		},

		reactivateMenu : function () {
			var $panel = BOLDGRID.EDITOR.Panel.$element;
			if ( this.$activeElement && $panel.is( ':visible' ) ) {
				this.$element.find( '[data-action="menu-' + $panel.attr( 'data-type' ) + '"]' )
					.addClass( 'active' );
			}
		}

	};

	self = BOLDGRID.EDITOR.Menu;

} )( jQuery );