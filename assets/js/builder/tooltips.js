var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Tooltip = {

		/**
		 * @var template.
		 * @since 1.2.7
		 */
		template : wp.template( 'boldgrid-editor-tooltip' ),

		/**
		 * Render help tooltips.
		 * 
		 * @since 1.2.7
		 */
		renderTooltips : function () {
			$.each( BoldgridEditor.builder_config.helpTooltip, function ( selector, message ) {
				BG.Panel.$element.add( BOLDGRID.EDITOR.CONTROLS.Color.$colorPanel ).find( selector ).each( function () {
					var $this = $( this );

					if ( false === $this.children().first().hasClass('boldgrid-tooltip-wrap') ) {
						$this.prepend( self.template( { 'message' : message } ) );
					}
				} );
			} );
		}
	};

	self = BOLDGRID.EDITOR.Tooltip;

} )( jQuery );