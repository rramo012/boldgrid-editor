var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;
	
	BOLDGRID.EDITOR.CONTROLS.Color = {

		name : 'font',
			
		section : 'row',
	
		priority : 10,
		
		iconClasses : 'genericon genericon-paintbrush',
		
		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section', '.fa' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		onMenuClick : function ( e ) {
			
		}
		
	};
	
	BOLDGRID.EDITOR.CONTROLS.Color.init();
	self = BOLDGRID.EDITOR.CONTROLS.Color;
	
} )( jQuery );