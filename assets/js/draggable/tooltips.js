var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Tooltip = {
			
		template : wp.template( 'boldgrid-editor-tooltip' ),
			
		renderTooltips : function () {
			$.each( BoldgridEditor.builder_config.helpTooltip, function ( selector, message ) {
				BG.Panel.$element.find( selector ).each( function () {
					var $this = $( this );
						
					if ( false === $this.next().hasClass('boldgrid-tooltip-wrap') ) {
						$this.prepend( self.template( { 'message' : message } ) );
					}
				} );
			} );
		}
	};

	self = BOLDGRID.EDITOR.Tooltip;

} )( jQuery );