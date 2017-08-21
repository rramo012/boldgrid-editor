var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Customclasses = {

		template: wp.template( 'boldgrid-editor-custom-classes' ),

		/**
		 * Render the control.
		 *
		 * @since 1.5.1
		 */
		render: function() {
			BG.Panel.$element.find( '.panel-body .customize' ).find( '.section.custom-classes' ).remove();
			BG.Panel.$element.find( '.panel-body .customize' ).append( this.template() );
		},

		/**
		 * Bind the input event to newly created cnotrol.
		 *
		 * @since 1.5.1
		 */
		bind: function() {
			var panel = BG.Panel,
				$target = BG.Menu.getCurrentTarget(),
				currentClasses = $target.attr('custom-classes');

			panel.$element.find( '[name="custom-classes"]' ).on( 'input', function() {
				var $this = $( this ),
					customClasses = $target.attr('custom-classes'),
					value = $this.attr( 'value' );

				value = value.replace( ',', ' ' );

				$target.removeClass( customClasses );
				$target.attr( 'custom-classes', value );
				$target.addClass( value );
			} )
			.val( currentClasses );

			panel.$element.find('.custom-classes').show();
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Classes;

} )( jQuery );
