var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;
	
	BOLDGRID.EDITOR.CONTROLS.Font = {

		name : 'font',
			
		section : 'row',
	
		priority : 10,
		
		iconClasses : 'genericon genericon-tumblr',
		
		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		onMenuClick : function ( e ) {
			
		}
		
	};
	
	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;
	
} )( jQuery );