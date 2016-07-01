var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Background = {

		name : 'background',

		priority : 80,

		iconClasses : 'genericon genericon-gallery',

		selectors : [ '.boldgrid-section' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Background',
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

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );