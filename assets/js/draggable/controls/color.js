var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Color = {

		create : function () {
			var template = wp.template( 'boldgrid-editor-color' );
			return template();
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;

} )( jQuery );