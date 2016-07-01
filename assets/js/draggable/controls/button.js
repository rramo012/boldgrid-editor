var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Button = {

		name : 'button',

		priority : 2,

		iconClasses : 'fa fa-cog',

		selectors : [ 'a.button', 'a.button-secondary', 'a.button-primary' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		panel : {
			title : 'Button Design',
			height : '600px',
			width : '400px',
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		openPanel : function () {
			var panel = BOLDGRID.EDITOR.Panel;
			
			// Remove all content from the panel.
			panel.clear();
			
			panel.$element.find('.panel-body').html('<h1>Coming Soon</h1>');

			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Button.init();
	self = BOLDGRID.EDITOR.CONTROLS.Button;

} )( jQuery );