var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Color = {

		create : function () {
			var template = wp.template( 'boldgrid-editor-color' );
			
			
			var colors = [];
			$.each( BoldgridEditor.colors, function ( key ) {
				
				var colorNum = key + 1; 
				colors.push( {
					'color' : this,
					'colorClass' : 'color' + colorNum + '-color',
				} );
			} );
			
			
			return template( {
				'colors' : colors
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;

} )( jQuery );