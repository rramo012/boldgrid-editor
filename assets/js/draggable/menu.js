var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
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
			this.$element = $( BoldgridEditor.instanceMenu );

			$( '#mceu_34' ).append( this.$element );

		},

		setupMenuDrag : function() {
			this.$element.find( 'ul' ).draggable( {
				containment: '#wp-content-editor-container',
				//handle: '.boldgrid-instance-menu ul',
				scroll : false,
				axis: "x"
			} )
		},

		createListItem : function ( control ) {

			var $li = $('<li></li>').attr( 'data-action', 'menu-' + control.name ),
				$icon = $( '<span></span>' ).addClass( control.iconClasses );

			$li.append( $icon );

			this.$element.find( 'ul' ).append( $li );
		},

		activateControl : function ( control ) {
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