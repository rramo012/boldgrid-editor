var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	var self;

	BOLDGRID.EDITOR.Menu = {

		$element : null,

		/**
		 * Initialize the panel.
		 */
		init : function () {

			this.create();

			return this.$element;
		},

		getTarget : function ( control ) {
			return this.$element.targetData[ control.name ];
		},

		create : function () {
			this.$element = $( BoldgridEditor.instanceMenu );

			$( '#mceu_34' ).append( this.$element );
		},

		createListItem : function ( control ) {

			var $li = $('<li></li>').attr( 'data-action', 'menu-' + control.name ),
				$icon = $( '<span></span>' ).addClass( control.iconClasses );

			$li.append( $icon );

			this.$element.find( 'ul' ).append( $li );
		},


	};

	self = BOLDGRID.EDITOR.Menu;

} )( jQuery );